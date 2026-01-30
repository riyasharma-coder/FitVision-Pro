package com.fitvision.controller;

import com.fitvision.model.UserHistory;
import com.fitvision.model.BrandSize;
import com.fitvision.model.BodyProfile;
import com.fitvision.repository.UserHistoryRepository;
import com.fitvision.repository.BrandSizeRepository;
import com.fitvision.repository.BodyProfileRepository;
import com.fitvision.service.SizingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * REST Controller for managing fit profiles, brand recommendations, and predictive analytics.
 * Integrated with ANSUR II dataset for statistical body measurement prediction.
 */
@RestController
@RequestMapping("/api/fit")
@CrossOrigin(origins = "http://localhost:5173")
public class FitController {

    @Autowired
    private SizingService sizingService;

    @Autowired
    private UserHistoryRepository historyRepository;

    @Autowired
    private BrandSizeRepository brandSizeRepository;

    @Autowired
    private BodyProfileRepository bodyProfileRepository;

    /**
     * Predictive Analytics: Fetches mean measurements from the ANSUR II dataset
     * based on user height and gender.
     */
    @GetMapping("/predict-size")
    public ResponseEntity<?> predictMeasurements(@RequestParam double height, @RequestParam String gender) {
        // Define a range of +/- 2cm for statistical relevance
        List<BodyProfile> similarProfiles = bodyProfileRepository.findByGenderAndHeightRange(
                gender.toLowerCase(), height - 2.0, height + 2.0
        );

        if (similarProfiles.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        // Calculate averages for the similar body profiles
        double avgChest = similarProfiles.stream().mapToDouble(BodyProfile::getChest_cm).average().orElse(0);
        double avgWaist = similarProfiles.stream().mapToDouble(BodyProfile::getWaist_cm).average().orElse(0);
        double avgHips = similarProfiles.stream().mapToDouble(BodyProfile::getHips_cm).average().orElse(0);

        return ResponseEntity.ok(Map.of(
                "predictedChest", Math.round(avgChest * 10.0) / 10.0,
                "predictedWaist", Math.round(avgWaist * 10.0) / 10.0,
                "predictedHips", Math.round(avgHips * 10.0) / 10.0,
                "sampleSize", similarProfiles.size()
        ));
    }

    /**
     * Calculates size for a specific brand and persists the scan result to history.
     */
    @GetMapping("/suggest")
    public String getPerfectFit(
            @RequestParam String brand,
            @RequestParam double chest,
            @RequestParam double waist,
            @RequestParam double hips
    ) {
        String result = sizingService.calculateSize(brand, chest, waist, hips);

        List<BrandSize> matches = brandSizeRepository.findByBrandNameContainingIgnoreCase(brand);
        String finalBrandName = (!matches.isEmpty()) ? matches.get(0).getBrandName() : brand;

        UserHistory history = new UserHistory();
        history.setBrandName(finalBrandName);
        history.setChest(chest);
        history.setWaist(waist);
        history.setHips(hips);
        history.setRecommendedSize(result);
        history.setScanDate(LocalDateTime.now());

        historyRepository.save(history);

        return result;
    }

    /**
     * Retrieves brand recommendations matching user metrics.
     */
    @GetMapping({"/wardrobe", "/explore-all"})
    public List<BrandRecommendation> getWardrobeRecommendations(
            @RequestParam double chest,
            @RequestParam double waist,
            @RequestParam double hips
    ) {
        List<BrandSize> allBrandConfigs = brandSizeRepository.findAll();

        return allBrandConfigs.stream()
                .filter(bs -> isWithinRange(chest, waist, hips, bs))
                .map(bs -> new BrandRecommendation(
                        bs.getBrandName(),
                        bs.getCategory(),
                        bs.getSize(),
                        "Perfect Fit",
                        "#10b981"
                ))
                .collect(Collectors.toList());
    }

    private boolean isWithinRange(double c, double w, double h, BrandSize bs) {
        return (c >= bs.getMinChest() && c <= bs.getMaxChest()) &&
                (w >= bs.getMinWaist() && w <= bs.getMaxWaist()) &&
                (h >= bs.getMinHips() && h <= bs.getMaxHips());
    }

    @GetMapping("/history")
    public List<UserHistory> getAllHistory() {
        return historyRepository.findAll();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteHistory(@PathVariable String id) {
        if (historyRepository.existsById(id)) {
            historyRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    public static class BrandRecommendation {
        public String brand;
        public String name;
        public String suggestedSize;
        public String fitStatus;
        public String themeColor;

        public BrandRecommendation(String brand, String category, String size, String fitStatus, String themeColor) {
            this.brand = brand;
            this.name = category;
            this.suggestedSize = size;
            this.fitStatus = fitStatus;
            this.themeColor = themeColor;
        }
    }
}

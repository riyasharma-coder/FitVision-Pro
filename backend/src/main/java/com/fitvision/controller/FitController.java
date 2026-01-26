package com.fitvision.controller;

import com.fitvision.model.UserHistory;
import com.fitvision.model.BrandSize;
import com.fitvision.repository.UserHistoryRepository;
import com.fitvision.repository.BrandSizeRepository;
import com.fitvision.service.SizingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/fit")
@CrossOrigin(origins = "http://localhost:5173") // Vite/React port
public class FitController {

    @Autowired
    private SizingService sizingService;

    @Autowired
    private UserHistoryRepository historyRepository;

    @Autowired
    private BrandSizeRepository brandSizeRepository;

    /**
     * 1. Single Brand Suggestion & History Save
     */
    @GetMapping("/suggest")
    public String getPerfectFit(
            @RequestParam String brand,
            @RequestParam double chest,
            @RequestParam double waist,
            @RequestParam double hips
    ) {
        // Size calculate karo logic service se
        String result = sizingService.calculateSize(brand, chest, waist, hips);

        // Brand name auto-correct: "lev" -> "Levi's"
        List<BrandSize> matches = brandSizeRepository.findByBrandNameContainingIgnoreCase(brand);
        String finalBrandName = (!matches.isEmpty()) ? matches.get(0).getBrandName() : brand;

        // History save karo database mein
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
     * 2. Explore All Brands - "The Virtual Wardrobe" Logic
     * Returns a list of all brands where the user's measurements fit perfectly.
     */
    @GetMapping("/explore-all")
    public List<BrandRecommendation> exploreAll(
            @RequestParam double chest,
            @RequestParam double waist,
            @RequestParam double hips
    ) {
        List<BrandSize> allBrandConfigs = brandSizeRepository.findAll();

        return allBrandConfigs.stream()
                .filter(bs -> isFit(chest, waist, hips, bs))
                .map(bs -> new BrandRecommendation(
                        bs.getBrandName(),
                        bs.getCategory(),
                        bs.getSize(),
                        "Perfect Fit",
                        "#10b981" // Green accent for UI
                ))
                .collect(Collectors.toList());
    }

    // Helper method to check range matching
    private boolean isFit(double c, double w, double h, BrandSize bs) {
        return (c >= bs.getMinChest() && c <= bs.getMaxChest()) &&
                (w >= bs.getMinWaist() && w <= bs.getMaxWaist()) &&
                (h >= bs.getMinHips() && h <= bs.getMaxHips());
    }

    @GetMapping("/history")
    public List<UserHistory> getAllHistory() {
        return historyRepository.findAll();
    }

    @DeleteMapping("/delete/{id}")
    public void deleteHistory(@PathVariable String id) {
        historyRepository.deleteById(id);
    }

    // --- Inner DTO for clean API Response ---
    public static class BrandRecommendation {
        public String brand;
        public String category;
        public String size;
        public String fitStatus;
        public String themeColor;

        public BrandRecommendation(String brand, String category, String size, String fitStatus, String themeColor) {
            this.brand = brand;
            this.category = category;
            this.size = size;
            this.fitStatus = fitStatus;
            this.themeColor = themeColor;
        }
    }
}
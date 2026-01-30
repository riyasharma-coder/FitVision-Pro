package com.fitvision.service;

import com.fitvision.model.BrandSize;
import com.fitvision.model.UserHistory;
import com.fitvision.repository.BrandSizeRepository;
import com.fitvision.repository.UserHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SizingService {

    @Autowired
    private BrandSizeRepository repository;

    @Autowired
    private UserHistoryRepository historyRepository;

    public String calculateSize(String brand, double chest, double waist, double hips) {

        // 1. ✨ Update: Ab ye 'levi' ko bhi 'Levi's' se match kar lega
        // findByBrandNameIgnoreCase ki jagah findByBrandNameContainingIgnoreCase use kiya
        List<BrandSize> brandCharts = repository.findByBrandNameContainingIgnoreCase(brand);

        // Default message agar range match na ho
        String finalSize = "Measurement out of range for " + brand;

        if (brandCharts.isEmpty()) {
            return "Brand not found! Check your database.";
        }

        // 2. Size calculation logic (Existing logic preserved)
        for (BrandSize chart : brandCharts) {
            boolean chestMatches = (chest >= chart.getMinChest() && chest <= chart.getMaxChest());
            boolean waistMatches = (waist >= chart.getMinWaist() && waist <= chart.getMaxWaist());

            // Hips logic: Supporting cases where hips might be 0 or outside range
            boolean hipsMatches = (hips >= chart.getMinHips() && hips <= chart.getMaxHips());

            if (chestMatches && waistMatches && hipsMatches) {
                finalSize = chart.getSize();
                break;
            }
        }

        // 3. Scan History ko Atlas mein save karo (Feature kept intact)
        saveToHistory(brand, chest, waist, hips, finalSize);

        return finalSize;
    }

    private void saveToHistory(String brand, double chest, double waist, double hips, String size) {
        UserHistory history = new UserHistory();
        history.setBrandName(brand);
        history.setChest(chest);
        history.setWaist(waist);
        history.setHips(hips);
        history.setRecommendedSize(size);

        historyRepository.save(history);
    }
}


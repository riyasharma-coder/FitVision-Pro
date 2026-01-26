package com.fitvision;

import com.fitvision.model.BrandSize;
import com.fitvision.repository.BrandSizeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class FitvisionApplication {

    public static void main(String[] args) {
        SpringApplication.run(FitvisionApplication.class, args);
    }

    // --- 🚀 Initial Data Seeding for Phase 1 ---
    @Bean
    CommandLineRunner runner(BrandSizeRepository repo) {
        return args -> {
            // Check if data already exists to avoid duplicates
            if (repo.count() == 0) {
                System.out.println("📦 Database is empty. Adding Brand Size Charts...");

                // ZARA Sizing (Premium Fit)
                repo.save(createSize("Zara", "Men-Shirt", "S", 88.0, 93.0, 74.0, 79.0));
                repo.save(createSize("Zara", "Men-Shirt", "M", 94.0, 100.0, 80.0, 87.0));
                repo.save(createSize("Zara", "Men-Shirt", "L", 101.0, 108.0, 88.0, 95.0));

                // MYNTRA Sizing (Standard Fit - Often runs smaller)
                repo.save(createSize("Myntra", "Men-Shirt", "S", 86.0, 91.0, 72.0, 77.0));
                repo.save(createSize("Myntra", "Men-Shirt", "M", 92.0, 97.0, 78.0, 84.0));
                repo.save(createSize("Myntra", "Men-Shirt", "L", 98.0, 104.0, 85.0, 92.0));

                // AMAZON Sizing (Comfort Fit - Often runs larger)
                repo.save(createSize("Amazon", "Men-Shirt", "M", 96.0, 102.0, 82.0, 89.0));
                repo.save(createSize("Amazon", "Men-Shirt", "L", 103.0, 110.0, 90.0, 98.0));

                System.out.println("✅ Zara, Myntra, and Amazon data seeded successfully!");
            } else {
                System.out.println("✅ Brand data already exists in MongoDB. Skipping seed.");
            }
        };
    }

    // Helper method to keep code clean
    private BrandSize createSize(String brand, String cat, String size, double minC, double maxC, double minW, double maxW) {
        BrandSize bs = new BrandSize();
        bs.setBrandName(brand);
        bs.setCategory(cat);
        bs.setSize(size);
        bs.setMinChest(minC);
        bs.setMaxChest(maxC);
        bs.setMinWaist(minW);
        bs.setMaxWaist(maxW);
        return bs;
    }
}

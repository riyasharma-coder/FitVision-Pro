package com.fitvision.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "brand_sizes")
public class BrandSize {

    @Id
    private String id;

    @Indexed
    private String brandName;

    @Indexed
    private String category;

    private String size;

    private double minChest;
    private double maxChest;
    private double minWaist;
    private double maxWaist;
    private double minHips;
    private double maxHips;
}

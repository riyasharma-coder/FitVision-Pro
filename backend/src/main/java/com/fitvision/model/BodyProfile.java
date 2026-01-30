package com.fitvision.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * Entity representing the ANSUR II anthropometric data.
 * This class is used to fetch statistical body measurements for size prediction.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "body_profiles")
public class BodyProfile {

    @Id
    private String id;

    private String gender;

    @Field("height_cm")
    private double height_cm;

    @Field("chest_cm")
    private double chest_cm;

    @Field("waist_cm")
    private double waist_cm;

    @Field("hips_cm")
    private double hips_cm;

    @Field("weight_kg")
    private double weight_kg;

    @Field("shoulder_width_cm")
    private double shoulder_width_cm;
}

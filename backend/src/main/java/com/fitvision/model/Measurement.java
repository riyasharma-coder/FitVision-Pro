package com.fitvision.model;

import lombok.Data;

@Data
public class Measurement {
    private Double chest;   // in cm
    private Double waist;   // in cm
    private Double hips;    // in cm
    private Double height;  // in cm
    private String gender;  // Male/Female (sizing charts ke liye zaroori hai)
}

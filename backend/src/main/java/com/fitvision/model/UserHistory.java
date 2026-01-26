package com.fitvision.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Document(collection = "user_history")
public class UserHistory {

    @Id
    private String id;

    private String brandName;
    private double chest;
    private double waist;
    private double hips;
    private String recommendedSize;

    private LocalDateTime scanDate = LocalDateTime.now();
}


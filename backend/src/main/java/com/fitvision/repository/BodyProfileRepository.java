package com.fitvision.repository;

import com.fitvision.model.BodyProfile;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BodyProfileRepository extends MongoRepository<BodyProfile, String> {

    // Using @Query to explicitly target the height_cm field in MongoDB
    @Query("{ 'gender': ?0, 'height_cm': { $gte: ?1, $lte: ?2 } }")
    List<BodyProfile> findByGenderAndHeightRange(String gender, double minHeight, double maxHeight);
}

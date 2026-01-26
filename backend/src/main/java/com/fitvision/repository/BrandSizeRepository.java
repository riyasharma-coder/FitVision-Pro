package com.fitvision.repository;

import com.fitvision.model.BrandSize;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository // Spring ko batata hai ki ye database layer hai
public interface BrandSizeRepository extends MongoRepository<BrandSize, String> {

    List<BrandSize> findByBrandNameContainingIgnoreCase(String brandName);

    List<BrandSize> findByBrandNameIgnoreCase(String brandName);

    List<BrandSize> findByBrandNameIgnoreCaseAndCategory(String brandName, String category);
}

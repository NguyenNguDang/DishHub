package com.nd.dishhub.service;

import com.cloudinary.Cloudinary;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FileUploadService {
    
    private final Cloudinary cloudinary;
    
    public String uploadFile(MultipartFile file) throws IOException {
        var uploadResult = cloudinary.uploader().upload(file.getBytes(), Map.of());
        return uploadResult.get("url").toString();
    }
}
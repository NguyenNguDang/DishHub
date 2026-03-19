package com.nd.dishhub.model;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserEntity extends AbstractEntity<Long> {
    private String firstName;
    private String lastName;
    private int Age;
    private float Weight;
    private float Height;
    private String email;
    private String passwordHash;
   
}

package cz.skrisjak.crew_planner.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import net.minidev.json.annotate.JsonIgnore;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Table(name="app_user")
@ToString(exclude = "shiftPlans")
public class User {
    @Id
    private String email;
    @Enumerated(value = EnumType.STRING)
    private Role role;
    private String name;
    private String nickName;
    private String image;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<ShiftPlan> shiftPlans = new ArrayList<>();
}
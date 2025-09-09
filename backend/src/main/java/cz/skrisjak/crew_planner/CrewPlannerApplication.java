package cz.skrisjak.crew_planner;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CrewPlannerApplication {

	public static void main(String[] args) {
		SpringApplication.run(CrewPlannerApplication.class, args);
	}

}

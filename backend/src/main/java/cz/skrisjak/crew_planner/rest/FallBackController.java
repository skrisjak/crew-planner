package cz.skrisjak.crew_planner.rest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class FallBackController {

    @GetMapping({"/home/**", "/users/**", "/hours/**", "/shopList/**"})
    public String fallback() {
        return "forward:/index.html";
    }
}

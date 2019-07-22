package com.circleci.demos.javajibdemo.controllers;

import com.circleci.demos.javajibdemo.models.BuildInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
public class HelloController {
    private final BuildInfo buildInfo;

    @Autowired
    public HelloController(BuildInfo buildInfo) {
        this.buildInfo = buildInfo;
    }

    @RequestMapping("/")
    public String index() {
        return "Greetings from Spring Boot!";
    }

    @GetMapping("/build-info")
    @ResponseBody
    public BuildInfo greeting() {
        return buildInfo;
    }

}
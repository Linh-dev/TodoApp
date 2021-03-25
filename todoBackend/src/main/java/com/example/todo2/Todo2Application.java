package com.example.todo2;

import com.example.todo2.config.SwaggerConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Import;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
@Import(SwaggerConfiguration.class)
public class Todo2Application {

    public static void main(String[] args) {
        SpringApplication.run(Todo2Application.class, args);
    }

}

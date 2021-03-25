package com.example.todo2.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "todo")
public class Todo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private boolean isCompleted;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference
    private User user;

    public Todo(String title, User user){
        this.title = title;
        this.user = user;
    }

    public Todo(Long id, String title, User user) {
        this.id = id;
        this.title = title;
        this.user = user;
    }

    public Todo(Long id, String title) {
        this.id = id;
        this.title = title;
    }

    public void setCompleted(boolean completed) {
        isCompleted = completed;
    }
}

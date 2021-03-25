package com.example.todo2.repository;

import com.example.todo2.model.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.*;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {

    @Query("SELECT e FROM Todo e WHERE e.user.id = :id")
    List<Todo> findAllByUser_Id(@Param("id") Long id);

}

package com.example.todo2.controller;

import com.example.todo2.dto.TodoRequest;
import com.example.todo2.dto.TodoResponse;
import com.example.todo2.model.Todo;
import com.example.todo2.model.User;
import com.example.todo2.model.VerificationToken;
import com.example.todo2.repository.UserRepository;
import com.example.todo2.repository.VerificationTokenRepository;
import com.example.todo2.security.JwtAuthenticationFilter;
import com.example.todo2.service.TodoService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.*;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/api/todo")
@AllArgsConstructor
public class TodoController {
    private final TodoService todoService;
    private final VerificationTokenRepository tokenRepository;
    private final JwtAuthenticationFilter authenticationFilter;
    private final UserRepository userRepository;

    @GetMapping("/all")
    public ResponseEntity<List<Todo>> getAllTodos(HttpServletRequest request) {
        Long userId = getUserId(request);
        return ResponseEntity.status(HttpStatus.OK).body(todoService.getAllByUserid(userId.longValue()));
    }

    @PostMapping("/allComplete")
    public ResponseEntity<List<Todo>> getAllComplete(HttpServletRequest request, @RequestBody Boolean isCheck){
        Long userId = getUserId(request);
        return ResponseEntity.status(OK).body(todoService.getAllComplete(userId,isCheck));
    }

    @PostMapping("/create")
    public ResponseEntity<Void> createTodo(HttpServletRequest request, @RequestBody TodoRequest todoRequest){
        Long userId = getUserId(request);
        User user = userRepository.getOne(userId);
        Todo todo = new Todo(todoRequest.getTitle(), user);
        todoService.save(todo);
        return new ResponseEntity<>(CREATED);
    }

    @PutMapping("/update")
    public ResponseEntity<Void> updateTodo(@RequestBody TodoResponse todoResponse, HttpServletRequest request) {
        Todo todo = mapTodo(todoResponse);
        todo.setUser(userRepository.getOne(getUserId(request)));
        todoService.save(todo);
        return new ResponseEntity<>(OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable(value = "id")Long id){
        todoService.delete(id);
        return new ResponseEntity<>(OK);
    }

    @DeleteMapping("/deleteCompleted")
    public ResponseEntity<Void> deleteTodos(HttpServletRequest request){
        Long id = getUserId(request);
        todoService.deleteCompleted(id);
        return new ResponseEntity<>(OK);
    }

    @PutMapping("/change")
    public ResponseEntity<Void> changeStatus(@RequestBody Long id){
        todoService.changeStatus(id);
        return new ResponseEntity<>(OK);
    }

    @GetMapping("/changeAllComplete")
    public ResponseEntity<Void> changeUncheckedAll(HttpServletRequest request){
        Long id = getUserId(request);
        todoService.checkComplete(id);
        return new ResponseEntity<>(OK);
    }

    private Todo mapTodo(TodoResponse todoResponse){
        Todo todo = new Todo();
        todo.setId(todoResponse.getId());
        todo.setTitle(todoResponse.getTitle());
        todo.setCompleted(todoResponse.isCompleted());
        return todo;
    }
    private Long getUserId(HttpServletRequest request){
        String token = authenticationFilter.getJwtFromRequest(request);
        Optional<VerificationToken> verificationToken = tokenRepository.findByToken(token);
        Long userId = verificationToken.get().getUser().getId();
        return userId;
    }
}

package com.example.todo2.service;

import com.example.todo2.model.Todo;
import com.example.todo2.repository.TodoRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

import static java.util.stream.Collectors.toList;


@Service
@AllArgsConstructor
public class TodoService {
    private final TodoRepository todoRepository;

    @Transactional(readOnly = true)
    public Optional<Todo> findById(Long id) {
        return todoRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Todo> getAllByUserid(Long id) {
        return todoRepository.findAllByUser_Id(id).stream().collect(toList());
    }

    @Transactional(readOnly = true)
    public List<Todo> getAllComplete(Long id, boolean isCheck){
        List<Todo> todoList = getAllByUserid(id);
        List<Todo> todos = new ArrayList<>();
        for (int i = 0; i < todoList.size(); i++){
            if (todoList.get(i).isCompleted()==isCheck){
                todos.add(todoList.get(i));
            }
        }
        return todos;
    }

    @Transactional
    public void save(Todo todo) {
        todoRepository.save(todo);
    }

    @Transactional
    public void delete(Long id) {
        todoRepository.deleteById(id);
    }

    @Transactional
    public void changeStatus(Long id) {
        Todo todo = todoRepository.findById(id).get();
        todo.setCompleted(!todo.isCompleted());
        todoRepository.save(todo);
    }

    @Transactional
    public void deleteCompleted(Long id){
        List<Todo> todoList = getAllByUserid(id);
        for (int i = 0; i < todoList.size(); i++){
            if (todoList.get(i).isCompleted()==true){
                todoRepository.delete(todoList.get(i));
            }
        }
    }

    @Transactional
    public void checkComplete(Long id){
        boolean check = testComplete(id);
        if (!check){
            checkedAll(id);
        }
        else {
            uncheckedAll(id);
        }
    }

    private boolean testComplete(Long id) {
        List<Todo> todoList = getAllByUserid(id);
        for (int i = 0; i < todoList.size(); i++) {
            if (todoList.get(i).isCompleted() == false) {
                return false;
            }
        }
        return true;
    }

    private void checkedAll(Long id) {
        List<Todo> todoList = getAllByUserid(id);
        for (int i = 0; i < todoList.size(); i++) {
            if (todoList.get(i).isCompleted()==false){
                todoList.get(i).setCompleted(true);
                todoRepository.save(todoList.get(i));
            }
        }
    }

    private void uncheckedAll(Long id){
        List<Todo> todoList = getAllByUserid(id);
        for (int i = 0; i < todoList.size(); i++) {
            if (todoList.get(i).isCompleted()==true){
                todoList.get(i).setCompleted(false);
                todoRepository.save(todoList.get(i));
            }
        }
    }
}

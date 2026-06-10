package com.example.demo.service;

import com.example.demo.repository.TaskRepository;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.entity.Task;

// ----- ロジック -----
@Service
public class TaskService {
    private final TaskRepository repository;

    public TaskService(TaskRepository repository) {
        this.repository = repository;
    }

    // 取得
    public List<Task> findAll() {
        return repository.findAll();
    }

    // 追加
    public Task save(Task task) {
        return repository.save(task);
    }

    // 削除
    public void delete(Long id) {
        repository.deleteById(id);
    }
}

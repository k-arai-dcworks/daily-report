package com.example.demo.repository;

import com.example.demo.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

// ----- DB操作 -----
public interface TaskRepository extends JpaRepository<Task, Long> {

}

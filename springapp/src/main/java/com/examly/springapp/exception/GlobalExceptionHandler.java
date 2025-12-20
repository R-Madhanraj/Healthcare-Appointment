package com.examly.springapp.exception;

import org.springframework.http.*;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.*;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {
   
    

                @Override
protected ResponseEntity<Object> handleMethodArgumentNotValid(
        MethodArgumentNotValidException ex,
        HttpHeaders headers,
        HttpStatusCode status,
        org.springframework.web.context.request.WebRequest request) {

        LinkedHashSet<String> msgs = new LinkedHashSet<>();
        ex.getBindingResult().getAllErrors().forEach(err -> {
            String msg = err.getDefaultMessage();
            if (msg != null) msgs.add(msg);
        });
        Map<String, Object> body = new HashMap<>();
        body.put("message", String.join(", ", msgs));
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Object> handleResponseStatus(ResponseStatusException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("message", ex.getReason());
        return new ResponseEntity<>(body, ex.getStatusCode());
    }
}

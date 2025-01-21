package Allrecipes.Recipesdemo.Service;

import Allrecipes.Recipesdemo.Entities.Comment;
import Allrecipes.Recipesdemo.Exceptions.ResourceNotFoundException;
import Allrecipes.Recipesdemo.Repositories.CommentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CommentService {

    private final CommentRepository commentRepository;

    @Transactional
    public Comment createComment(Comment comment) {
        log.debug("Creating a new comment: {}", comment);
        Comment savedComment = commentRepository.save(comment);
        log.info("Created comment with ID: {}", savedComment.getId());
        return savedComment;
    }

    @Transactional(readOnly = true)
    public Comment getCommentById(Long id) {
        log.debug("Fetching comment with ID: {}", id);
        return commentRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Comment not found with ID: {}", id);
                    return new ResourceNotFoundException("Comment not found with id: " + id);
                });
    }

    @Transactional
    public Comment updateComment(Long id, Comment updated) {
        log.debug("Updating comment with ID: {}", id);
        Comment existing = commentRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Comment not found with ID: {}", id);
                    return new ResourceNotFoundException("Comment not found with id: " + id);
                });

        if (updated.getText() != null) {
            existing.setText(updated.getText());
            log.debug("Updated text of comment with ID: {}", id);
        }

        Comment savedComment = commentRepository.save(existing);
        log.info("Updated comment with ID: {}", savedComment.getId());
        return savedComment;
    }

    @Transactional
    public void deleteComment(Long id) {
        log.debug("Deleting comment with ID: {}", id);
        Comment existing = commentRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Comment not found with ID: {}", id);
                    return new ResourceNotFoundException("Comment not found with id: " + id);
                });

        commentRepository.delete(existing);
        log.info("Deleted comment with ID: {}", id);
    }

    @Transactional(readOnly = true)
    public List<Comment> getAllComments() {
        log.debug("Fetching all comments.");
        return commentRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Comment> getCommentsByRecipeId(Long recipeId) {
        log.debug("Fetching comments for recipe ID: {}", recipeId);
        return commentRepository.findByRecipeId(recipeId);
    }
}

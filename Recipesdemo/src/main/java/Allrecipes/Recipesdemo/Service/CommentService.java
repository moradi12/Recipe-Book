package Allrecipes.Recipesdemo.Service;

import Allrecipes.Recipesdemo.Entities.Comment;
import Allrecipes.Recipesdemo.Exceptions.ResourceNotFoundException;
import Allrecipes.Recipesdemo.Repositories.CommentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentService {

    private final CommentRepository commentRepository;

    /**
     * Create a new comment.
     */
    public Comment createComment(Comment comment) {
        return commentRepository.save(comment);
    }

    /**
     * Get a comment by its ID.
     */
    public Comment getCommentById(Long id) {
        return commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + id));
    }

    /**
     * Update an existing comment.
     */
    public Comment updateComment(Long id, Comment updated) {
        Comment existing = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + id));

        if (updated.getText() != null) {
            existing.setText(updated.getText());
        }

        return commentRepository.save(existing);
    }

    /**
     * Delete a comment by its ID.
     */
    public void deleteComment(Long id) {
        Comment existing = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + id));

        commentRepository.delete(existing);
    }

    /**
     * Get all comments.
     */
    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    /**
     * Get comments by recipe ID.
     */
    public List<Comment> getCommentsByRecipeId(Long recipeId) {
        return commentRepository.findByRecipeId(recipeId);
    }
}

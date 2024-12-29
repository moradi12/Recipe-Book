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

    /**
     * Create a new comment.
     *
     * @param comment The Comment entity to be created.
     * @return The saved Comment entity.
     */
    @Transactional
    public Comment createComment(Comment comment) {
        log.debug("Creating a new comment: {}", comment);
        Comment savedComment = commentRepository.save(comment);
        log.info("Created comment with ID: {}", savedComment.getId());
        return savedComment;
    }

    /**
     * Get a comment by its ID.
     *
     * @param id The ID of the comment.
     * @return The Comment entity.
     * @throws ResourceNotFoundException If the comment is not found.
     */
    @Transactional(readOnly = true)
    public Comment getCommentById(Long id) {
        log.debug("Fetching comment with ID: {}", id);
        return commentRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Comment not found with ID: {}", id);
                    return new ResourceNotFoundException("Comment not found with id: " + id);
                });
    }

    /**
     * Update an existing comment.
     *
     * @param id      The ID of the comment to update.
     * @param updated The Comment entity containing updated information.
     * @return The updated Comment entity.
     * @throws ResourceNotFoundException If the comment is not found.
     */
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

    /**
     * Delete a comment by its ID.
     *
     * @param id The ID of the comment to delete.
     * @throws ResourceNotFoundException If the comment is not found.
     */
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

    /**
     * Get all comments.
     *
     * @return A list of all Comment entities.
     */
    @Transactional(readOnly = true)
    public List<Comment> getAllComments() {
        log.debug("Fetching all comments.");
        return commentRepository.findAll();
    }

    /**
     * Get comments by recipe ID.
     *
     * @param recipeId The ID of the recipe.
     * @return A list of Comment entities associated with the recipe.
     */
    @Transactional(readOnly = true)
    public List<Comment> getCommentsByRecipeId(Long recipeId) {
        log.debug("Fetching comments for recipe ID: {}", recipeId);
        return commentRepository.findByRecipeId(recipeId);
    }
}

package Allrecipes.Recipesdemo;

import Allrecipes.Recipesdemo.Entities.Category;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

@Configuration
public class JacksonConfig {

    @Bean
    public Jackson2ObjectMapperBuilder jacksonBuilder() {
        return new Jackson2ObjectMapperBuilder() {
            @Override
            public void configure(ObjectMapper objectMapper) {
                super.configure(objectMapper);
                // link Category to CategoryMixin
                objectMapper.addMixIn(Category.class, CategoryMixin.class);
            }
        };
    }
}

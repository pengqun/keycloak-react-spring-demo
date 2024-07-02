package io.github.pengqun

import org.slf4j.LoggerFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration
import org.springframework.web.reactive.config.CorsRegistry
import org.springframework.web.reactive.config.WebFluxConfigurer


/**
 * @author pengqun
 */
@Configuration
class CorsConfig : WebFluxConfigurer {

    private val log = LoggerFactory.getLogger(CorsConfig::class.java)

    @Value("\${cors.allowed.origins}")
    private lateinit var allowedOrigins: String

    override fun addCorsMappings(registry: CorsRegistry) {
        if (allowedOrigins.isNotBlank()) {
            registry.addMapping("/**")
                .allowedOrigins(allowedOrigins)
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600)
            log.info("Added CORS allowed origins: {}", allowedOrigins)
        }
    }
}
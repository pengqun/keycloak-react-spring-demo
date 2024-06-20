package io.github.pengqun

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.Customizer
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.web.server.SecurityWebFilterChain


/**
 * @see <a href="https://docs.spring.io/spring-security/reference/reactive/oauth2/resource-server/index.html">Docs</a>
 * @author pengqun
 */
@Configuration
@EnableWebFluxSecurity
class SecurityConfig {

    @Bean
    fun securityWebFilterChain(http: ServerHttpSecurity): SecurityWebFilterChain {
        return http
            .authorizeExchange { exchange ->
                exchange.pathMatchers("/hello/public").permitAll()
                    .pathMatchers("/hello/private").authenticated()
                    .anyExchange().denyAll()
            }
            .oauth2ResourceServer { oauth2 ->
                oauth2.jwt(Customizer.withDefaults())
            }
            .build()
    }
}
package io.github.pengqun.model

import java.time.OffsetDateTime

data class Token(
    val issueAt: OffsetDateTime,
    val expiresAt: OffsetDateTime,
    val headers: Map<String, Any>,
    val claims: Map<String, Any>
)

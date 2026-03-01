package io.github.pengqun.model

import java.util.*

data class Greeting(
    val requestId: String = UUID.randomUUID().toString().lowercase(),
    val message: String,
    val token: Token? = null
)

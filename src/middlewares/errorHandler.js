export const errorHandler = (err, req, res, next) => {
    if (err instanceof Error && err.message.includes("Formato inválido")) {
        return res.status(400).json({ erro: "Formato de arquivo inválido", mensagem: err.message })
    }

    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ erro: "Arquivo muito grande", mensagem: "O tamanho máximo permitido é 5MB" })
    }

    return res.status(500).json({ erro: "Erro no upload", mensagem: err.message })
}

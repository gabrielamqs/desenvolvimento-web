type CardProps = {
    titulo: string,
    linkUrl: string,
    imagem: string,
    texto: string
}

function Card({ titulo, linkUrl, imagem, texto }: CardProps) {
    return (
        <div className="col">
            <div className="card">
                <img src={imagem} className="card-img-top" />
                <div className="card-body text-center">
                    <h5 className="card-title">{titulo}</h5>
                    <p className="card-text">{texto}</p>
                </div>
                <div className="card-footer text-center p-3">
                    <a href={linkUrl} className="btn btn-danger">
                        Adicionar ao Carrinho
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Card
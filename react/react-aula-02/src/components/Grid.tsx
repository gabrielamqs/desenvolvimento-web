import Card from "./Card";

type CardData = {
    id: number;
    imagem: string;
    titulo: string;
    texto: string;
    linkUrl: string;
}

type GridProps = {
    cards: CardData[];
    cols?: number;
}

function Grid({ cards, cols = 4 }: GridProps) {
    return (
        <>
            <div className={`row row-cols-${cols} g-3`}>
                {cards.map((card) => (
                    <Card imagem={card.imagem}
                        titulo={card.titulo}
                        texto={card.texto}
                        linkUrl={card.linkUrl}
                        key={card.id} />
                ))}
            </div>
        </>
    )
}

export default Grid;
type BoasVindasProps = {
    visitante: string
}   

function BoasVindas({ visitante = "Visitante" }: BoasVindasProps) {
    return (
        <>
            <p>Bem-vindo, {visitante}!</p>
        </>
    )
}

export default BoasVindas
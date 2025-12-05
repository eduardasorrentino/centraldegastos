// ---------------------- ARMAZENAMENTO ----------------------

let gastos = JSON.parse(localStorage.getItem("gastos")) || [];

// Salvar no localStorage
function salvarLocal() {
    localStorage.setItem("gastos", JSON.stringify(gastos));
}

// ---------------------- ADICIONAR GASTO ----------------------

function adicionarGasto() {
    const cartao = document.getElementById("cartao").value;
    const valor = parseFloat(document.getElementById("valor").value);
    const nota = document.getElementById("nota").value;
    const status = document.getElementById("status").value;
    const comprovanteInput = document.getElementById("comprovante");

    if (!valor) {
        alert("Digite um valor válido!");
        return;
    }

    let comprovanteBase64 = "";

    if (comprovanteInput.files.length > 0) {
        const file = comprovanteInput.files[0];
        const reader = new FileReader();

        reader.onload = function (e) {
            comprovanteBase64 = e.target.result;
            registrarGasto(cartao, valor, nota, status, comprovanteBase64);
        };

        reader.readAsDataURL(file);
    } else {
        registrarGasto(cartao, valor, nota, status, comprovanteBase64);
    }
}

function registrarGasto(cartao, valor, nota, status, comprovanteBase64) {
    const novoGasto = {
        id: Date.now(),
        cartao,
        valor,
        nota,
        status,
        comprovante: comprovanteBase64
    };

    gastos.push(novoGasto);
    salvarLocal();
    atualizarTabela();
    atualizarTotais();

    document.getElementById("valor").value = "";
    document.getElementById("nota").value = "";
    document.getElementById("comprovante").value = "";
    document.getElementById("status").value = "pendente";
}

// ---------------------- EXCLUIR GASTO ----------------------

function excluirGasto(id) {
    gastos = gastos.filter(g => g.id !== id);
    salvarLocal();
    atualizarTabela();
    atualizarTotais();
}

// ---------------------- ATUALIZAR TABELA ----------------------

function atualizarTabela() {
    const tabela = document.getElementById("gastos-lista");
    tabela.innerHTML = "";

    gastos.forEach(item => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${item.cartao}</td>
            <td>R$ ${item.valor.toFixed(2)}</td>
            <td>${item.nota || "-"}</td>

            <td class="status ${item.status}">
                ${item.status === "pago" ? "Pago" : "Pendente"}
            </td>

            <td>
                ${
                    item.comprovante
                        ? `<a href="${item.comprovante}" target="_blank">Ver</a>`
                        : "-"
                }
            </td>

            <td>
                <button class="delete-btn" onclick="excluirGasto(${item.id})">
                    Excluir
                </button>
            </td>
        `;

        tabela.appendChild(tr);
    });
}

// ---------------------- CALCULAR TOTAIS ----------------------

function atualizarTotais() {
    let totalBradesco = 0;
    let totalPorto = 0;

    gastos.forEach(g => {
        if (g.cartao === "Bradesco") totalBradesco += g.valor;
        if (g.cartao === "Porto Seguro") totalPorto += g.valor;
    });

    document.getElementById("total-bradesco").textContent = totalBradesco.toFixed(2);
    document.getElementById("total-porto").textContent = totalPorto.toFixed(2);
    document.getElementById("total-geral").textContent = (totalBradesco + totalPorto).toFixed(2);
}

// ---------------------- INICIALIZAÇÃO ----------------------

document.addEventListener("DOMContentLoaded", () => {
    atualizarTabela();
    atualizarTotais();
});

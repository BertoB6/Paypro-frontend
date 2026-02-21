// =============================================
// CONFIGURAÇÕES
// =============================================
const BACKEND_URL = 'https://paypro-backend-79fs.onrender.com'; // Altere para seu servidor

// =============================================
// VARIÁVEIS GLOBAIS
// =============================================
let logoBase64 = '';

// =============================================
// FUNÇÕES DE PREVIEW (ATUALIZAÇÃO EM TEMPO REAL)
// =============================================

function atualizarLogoPreview(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            logoBase64 = e.target.result;
            document.getElementById('previewLogo').innerHTML = 
                `<img src="${logoBase64}" style="max-width: 100%; max-height: 100%;">`;
            
            const logoNome = doc
// =============================================
// =============================================
// GERAR PÁGINA FINAL (completa - números copiáveis, botões, PayPal)
// =============================================
function gerarPaginaFinal(nomeLoja, corPrincipal, corTexto, instrucao, agradecimento, tempo, whatsapp, metodos, logoBase64) {
    
    // Função para card M-PESA ou E-MOLA (com USSD)
    function metodoCelular(metodo, icone, cor, numero, titular, codigoUssd) {
        if (!metodo.ativo) return '';
        
        const numeroLimpo = numero.replace(/\s+/g, '');
        
        return `
        <div class="payment-card" data-metodo="${metodo}">
            <div class="payment-header">
                <div class="payment-icon ${cor}-icon"><i class="${icone}"></i></div>
                <span class="payment-title">${metodo}</span>
                <span class="ussd-badge">${codigoUssd}</span>
            </div>
            
            <!-- Número copiável -->
            <div class="number-area" onclick="copiarNumero('${numeroLimpo}', '${titular}')">
                <div class="number-info">
                    <span class="number-value">${numero}</span>
                    <span class="number-titular">${titular}</span>
                </div>
                <div class="copy-icon">
                    <i class="fas fa-copy"></i>
                </div>
            </div>
            
            <!-- Botão pagar (abre discador) -->
            <button class="pay-button" onclick="abrirDiscador('${codigoUssd}')">
                <i class="fas fa-phone-alt"></i> Pagar com ${metodo}
            </button>
        </div>
        `;
    }
    
    // Função para card PAYPAL (sem USSD, só email)
    function metodoPaypal(metodo, icone, cor, email) {
        if (!metodo.ativo) return '';
        
        return `
        <div class="payment-card" data-metodo="PayPal">
            <div class="payment-header">
                <div class="payment-icon ${cor}-icon"><i class="${icone}"></i></div>
                <span class="payment-title">PayPal</span>
            </div>
            
            <!-- Email copiável -->
            <div class="number-area" onclick="copiarEmail('${email}')">
                <div class="number-info">
                    <span class="number-value">${email}</span>
                    <span class="number-titular">Email PayPal</span>
                </div>
                <div class="copy-icon">
                    <i class="fas fa-copy"></i>
                </div>
            </div>
            
            <!-- Link para PayPal (abre site) -->
            <button class="pay-button paypal-button" onclick="abrirPayPal('${email}')">
                <i class="fab fa-paypal"></i> Pagar com PayPal
            </button>
        </div>
        `;
    }
    
    // Montar os cards na ordem correta
    let metodosHTML = '';
    
    // 1. M-PESA (se ativo)
    if (metodos.mpesa.ativo) {
        metodosHTML += metodoCelular(
            'M-PESA', 
            'fas fa-mobile-alt', 
            'mpesa', 
            metodos.mpesa.numero, 
            metodos.mpesa.titular, 
            '*150#'
        );
    }
    
    // 2. E-MOLA (se ativo)
    if (metodos.emola.ativo) {
        metodosHTML += metodoCelular(
            'E-MOLA', 
            'fas fa-mobile-alt', 
            'emola', 
            metodos.emola.numero, 
            metodos.emola.titular, 
            '*898#'
        );
    }
    
    // 3. PAYPAL (se ativo)
    if (metodos.paypal.ativo) {
        metodosHTML += metodoPaypal(
            'PayPal', 
            'fab fa-paypal', 
            'paypal', 
            metodos.paypal.email
        );
    }
    
    return `<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${nomeLoja} - Pagamento</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', sans-serif;
            background: #f8fafc;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container { max-width: 500px; width: 100%; }
        .card {
            background: white;
            border-radius: 32px;
            padding: 32px 24px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }
        .logo {
            width: 100px; height: 100px;
            background: #f1f5f9;
            border-radius: 20px;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
        .logo img { max-width: 100%; max-height: 100%; }
        .store-name {
            text-align: center;
            font-size: 24px;
            font-weight: 700;
            margin-bottom: 16px;
            color: ${corTexto};
        }
        .instruction {
            text-align: center;
            color: #475569;
            font-size: 14px;
            margin-bottom: 24px;
        }
        
        /* Cards de pagamento */
        .payment-card {
            background: #f8fafc;
            border-radius: 20px;
            padding: 20px;
            margin-bottom: 20px;
            border: 1px solid #e2e8f0;
            transition: all 0.2s;
        }
        .payment-card:hover {
            border-color: ${corPrincipal};
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        
        .payment-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 15px;
        }
        .payment-icon {
            width: 48px; height: 48px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }
        .mpesa-icon { background: #00a85920; color: #00a859; }
        .emola-icon { background: #ff6b0020; color: #ff6b00; }
        .paypal-icon { background: #00308720; color: #003087; }
        
        .payment-title { font-size: 18px; font-weight: 700; }
        .ussd-badge {
            background: #1e293b; color: white;
            padding: 4px 12px; border-radius: 30px;
            font-size: 12px; font-weight: 600;
            margin-left: 10px;
        }
        
        /* Área do número copiável */
        .number-area {
            background: white;
            border-radius: 16px;
            padding: 15px;
            margin-bottom: 15px;
            border: 1px solid #e2e8f0;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.2s;
        }
        .number-area:active {
            background: #f1f5f9;
            transform: scale(0.99);
        }
        .number-info {
            display: flex;
            flex-direction: column;
        }
        .number-value {
            font-size: 18px; font-weight: 700;
            color: #0f172a;
        }
        .number-titular {
            font-size: 13px; color: #64748b;
            margin-top: 3px;
        }
        .copy-icon {
            color: ${corPrincipal};
            font-size: 20px;
            background: #e0e7ff;
            width: 40px; height: 40px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        /* Botão pagar */
        .pay-button {
            width: 100%;
            background: #1e293b;
            color: white;
            border: none;
            padding: 16px;
            border-radius: 16px;
            font-weight: 600;
            font-size: 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: all 0.2s;
        }
        .pay-button:hover {
            background: #0f172a;
            transform: translateY(-2px);
        }
        .paypal-button {
            background: #003087;
        }
        .paypal-button:hover {
            background: #001f5c;
        }
        
        /* Formulário */
        .form-group { margin-bottom: 16px; }
        .form-control {
            width: 100%; padding: 16px;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            font-size: 15px;
            transition: all 0.3s;
        }
        .form-control:focus {
            outline: none;
            border-color: ${corPrincipal};
            box-shadow: 0 0 0 3px ${corPrincipal}20;
        }
        .file-area {
            border: 2px dashed #e2e8f0;
            border-radius: 16px;
            padding: 24px;
            text-align: center;
            cursor: pointer;
            margin-bottom: 20px;
            transition: all 0.3s;
        }
        .file-area:hover {
            border-color: ${corPrincipal};
            background: #f8fafc;
        }
        .file-area i { font-size: 28px; color: #94a3b8; }
        
        /* Botão WhatsApp */
        .btn-whatsapp {
            width: 100%;
            background: #25D366;
            color: white;
            border: none;
            padding: 18px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            transition: all 0.3s;
            box-shadow: 0 10px 20px #25D36640;
        }
        .btn-whatsapp:hover {
            background: #128C7E;
            transform: translateY(-2px);
        }
        
        .footer {
            margin-top: 24px;
            text-align: center;
            font-size: 14px;
            color: #475569;
        }
        
        /* Toast de confirmação */
        .toast {
            position: fixed;
            bottom: 30px; left: 50%;
            transform: translateX(-50%);
            background: #1e293b;
            color: white;
            padding: 14px 28px;
            border-radius: 50px;
            font-size: 14px;
            font-weight: 500;
            opacity: 0;
            transition: opacity 0.3s;
            pointer-events: none;
            z-index: 1000;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            white-space: nowrap;
        }
        .toast.show { 
            opacity: 1; 
            animation: toastIn 0.3s ease;
        }
        
        @keyframes toastIn {
            from { transform: translateX(-50%) translateY(20px); opacity: 0; }
            to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
        
        @media (max-width: 480px) {
            .card { padding: 24px 16px; }
            .number-value { font-size: 16px; }
            .toast { 
                white-space: normal;
                text-align: center;
                width: 90%;
                font-size: 13px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <!-- LOGO -->
            <div class="logo">
                ${logoBase64 ? '<img src="logo.png" alt="Logo">' : '<i class="fas fa-store" style="color: #94a3b8; font-size: 40px;"></i>'}
            </div>
            
            <!-- NOME DA LOJA -->
            <h1 class="store-name">${nomeLoja}</h1>
            
            <!-- INSTRUÇÃO -->
            <div class="instruction">${instrucao}</div>
            
            <!-- MÉTODOS DE PAGAMENTO (na ordem correta) -->
            ${metodosHTML}
            
            <!-- FORMULÁRIO -->
            <form id="formComprovativo" onsubmit="event.preventDefault()">
                <div class="form-group">
                    <input type="text" class="form-control" id="nomeCliente" placeholder="Seu nome" required>
                </div>
                <div class="form-group">
                    <input type="number" class="form-control" id="valorPago" placeholder="Valor pago (MT)" required>
                </div>
                <div class="file-area" onclick="document.getElementById('fileInput').click()">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p style="margin-top: 8px;">Clique para anexar o comprovativo</p>
                    <input type="file" id="fileInput" accept="image/*" style="display: none;" required>
                </div>
                
                <!-- BOTÃO ENVIAR PARA WHATSAPP DO VENDEDOR -->
                <button type="button" class="btn-whatsapp" onclick="enviarComprovativo('${whatsapp}')">
                    <i class="fab fa-whatsapp"></i> Enviar comprovativo
                </button>
            </form>
            
            <!-- RODAPÉ -->
            <div class="footer">
                <p>${agradecimento} Verificaremos em até ${tempo}.</p>
            </div>
        </div>
    </div>
    
    <!-- TOAST PARA FEEDBACK VISUAL -->
    <div id="toast" class="toast"></div>
    
    <script>
        // =============================================
        // FUNÇÃO PARA COPIAR NÚMERO (M-PESA / E-MOLA)
        // =============================================
        function copiarNumero(numero, titular) {
            const texto = numero + ' (' + titular + ')';
            
            // Tenta usar a clipboard API moderna
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(texto).then(() => {
                    mostrarToast('✅ Número copiado: ' + numero);
                }).catch(() => {
                    copiarFallback(texto, numero);
                });
            } else {
                copiarFallback(texto, numero);
            }
        }
        
        // =============================================
        // FUNÇÃO PARA COPIAR EMAIL (PAYPAL)
        // =============================================
        function copiarEmail(email) {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(email).then(() => {
                    mostrarToast('✅ Email copiado: ' + email);
                }).catch(() => {
                    copiarFallback(email, email);
                });
            } else {
                copiarFallback(email, email);
            }
        }
        
        // =============================================
        // FALLBACK PARA COPIAR (DISPOSITIVOS ANTIGOS)
        // =============================================
        function copiarFallback(texto, exibir) {
            const textArea = document.createElement('textarea');
            textArea.value = texto;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            mostrarToast('✅ Copiado: ' + exibir);
        }
        
        // =============================================
        // FUNÇÃO PARA ABRIR DISCADOR (M-PESA / E-MOLA)
        // =============================================
        function abrirDiscador(codigo) {
            window.location.href = 'tel:' + encodeURIComponent(codigo);
            mostrarToast('📞 Discador aberto para ' + codigo);
        }
        
        // =============================================
        // FUNÇÃO PARA ABRIR PAYPAL
        // =============================================
        function abrirPayPal(email) {
            window.open('https://www.paypal.com/paypalme/' + email.split('@')[0], '_blank');
            mostrarToast('🌐 Abrindo PayPal...');
        }
        
        // =============================================
        // FUNÇÃO PARA ENVIAR COMPROVATIVO (WHATSAPP)
        // =============================================
        function enviarComprovativo(numeroVendedor) {
            const nome = document.getElementById('nomeCliente').value || 'Cliente';
            const valor = document.getElementById('valorPago').value || 'Valor não informado';
            const fileInput = document.getElementById('fileInput');
            
            if (!fileInput.files || fileInput.files.length === 0) {
                mostrarToast('❌ Anexe o comprovativo primeiro');
                return;
            }
            
            const mensagem = '🛒 NOVO PAGAMENTO 🛒\\n\\n' +
                           '👤 Cliente: ' + nome + '\\n' +
                           '💰 Valor: ' + valor + ' MT\\n' +
                           '📎 Anexo: ' + fileInput.files[0].name;
            
            window.open('https://wa.me/' + numeroVendedor.replace('+', '') + '?text=' + encodeURIComponent(mensagem), '_blank');
            mostrarToast('✅ WhatsApp aberto');
        }
        
        // =============================================
        // FUNÇÃO PARA MOSTRAR TOAST (FEEDBACK VISUAL)
        // =============================================
        function mostrarToast(mensagem) {
            const toast = document.getElementById('toast');
            toast.textContent = mensagem;
            toast.classList.add('show');
            
            // Esconder após 2.5 segundos
            setTimeout(() => {
                toast.classList.remove('show');
            }, 2500);
        }
        
        // =============================================
        // INICIALIZAÇÃO
        // =============================================
        console.log('✅ Página de pagamentos carregada');
    </script>
</body>
</html>`;
}
ument.getElementById('logoNome');
            logoNome.style.display = 'block';
            logoNome.textContent = '✅ Logo: ' + input.files[0].name;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function toggleMetodo(metodo) {
    const ativo = document.getElementById(metodo + 'Ativo').checked;
    const fields = document.getElementById(metodo + 'Fields');
    const preview = document.getElementById('preview' + metodo.charAt(0).toUpperCase() + metodo.slice(1));
    
    if (ativo) {
        fields.classList.add('active');
        if (preview) preview.style.display = 'flex';
    } else {
        fields.classList.remove('active');
        if (preview) preview.style.display = 'none';
    }
    atualizarPreview();
}

function atualizarPreview() {
    // Nome da loja
    const nomeLoja = document.getElementById('nomeLoja').value || 'Sua Loja';
    document.getElementById('previewNomeLoja').textContent = nomeLoja;
    document.getElementById('previewNomeLoja').style.color = document.getElementById('corTexto').value;
    
    // Instrução
    document.getElementById('previewInstrucao').textContent = 
        document.getElementById('textoInstrucao').value || 'Após o pagamento, anexe o comprovativo abaixo.';
    
    // Cor do botão
    const corPrincipal = document.getElementById('corPrincipal').value;
    document.getElementById('previewBotao').style.background = corPrincipal;
    
    // Atualizar detalhes dos métodos
    if (document.getElementById('mpesaAtivo').checked) {
        const numero = document.getElementById('mpesaNumero').value || '84 123 4567';
        const titular = document.getElementById('mpesaTitular').value || 'Titular';
        document.getElementById('previewMpesaDetalhes').textContent = `${numero} (${titular})`;
    }
    
    if (document.getElementById('emolaAtivo').checked) {
        const numero = document.getElementById('emolaNumero').value || '85 987 6543';
        const titular = document.getElementById('emolaTitular').value || 'Titular';
        document.getElementById('previewEmolaDetalhes').textContent = `${numero} (${titular})`;
    }
    
    if (document.getElementById('paypalAtivo').checked) {
        const email = document.getElementById('paypalEmail').value || 'email@paypal.com';
        document.getElementById('previewPaypalDetalhes').textContent = email;
    }
    
    // Rodapé
    const agradecimento = document.getElementById('textoAgradecimento').value || 'Obrigado!';
    const tempo = document.getElementById('tempoVerificacao').value || '30 minutos';
    document.getElementById('previewRodape').innerHTML = `
        ${agradecimento} Verificaremos em até ${tempo}.
        <div style="margin-top: 10px;">
            <i class="fab fa-whatsapp" style="color: #25D366;"></i> Falar no WhatsApp
        </div>
    `;
}

// =============================================
// FUNÇÕES DE PROGRESSO
// =============================================
function mostrarProgresso(percentual, texto) {
    const container = document.getElementById('progressContainer');
    const bar = document.getElementById('progressBar');
    const text = document.getElementById('progressText');
    
    container.style.display = 'block';
    text.style.display = 'block';
    bar.style.width = percentual + '%';
    text.textContent = texto;
}

function esconderProgresso() {
    setTimeout(() => {
        document.getElementById('progressContainer').style.display = 'none';
        document.getElementById('progressText').style.display = 'none';
    }, 2000);
}

// =============================================
// FUNÇÃO PRINCIPAL: ENVIAR PARA BACKEND
// =============================================
async function enviarParaBackend() {
    try {
        const btn = document.getElementById('btnEnviar');
        const textoOriginal = btn.innerHTML;
        
        // Desabilitar botão
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparando...';
        btn.disabled = true;
        
        mostrarProgresso(10, 'Preparando arquivos...');
        
        const nomeLoja = document.getElementById('nomeLoja').value || 'Minha Loja';
        
        // Gerar ZIP
        mostrarProgresso(30, 'Gerando site...');
        const zip = new JSZip();
        
        const corPrincipal = document.getElementById('corPrincipal').value || '#6366f1';
        const corTexto = document.getElementById('corTexto').value || '#1e293b';
        const instrucao = document.getElementById('textoInstrucao').value || 'Após o pagamento, anexe o comprovativo abaixo.';
        const agradecimento = document.getElementById('textoAgradecimento').value || 'Obrigado!';
        const tempo = document.getElementById('tempoVerificacao').value || '30 minutos';
        const whatsapp = document.getElementById('whatsappNumero').value || '+258841234567';
        
        const metodos = {
            mpesa: { 
                ativo: document.getElementById('mpesaAtivo').checked, 
                numero: document.getElementById('mpesaNumero').value, 
                titular: document.getElementById('mpesaTitular').value 
            },
            emola: { 
                ativo: document.getElementById('emolaAtivo').checked, 
                numero: document.getElementById('emolaNumero').value, 
                titular: document.getElementById('emolaTitular').value 
            },
            paypal: { 
                ativo: document.getElementById('paypalAtivo').checked, 
                email: document.getElementById('paypalEmail').value 
            }
        };
        
        const htmlFinal = gerarPaginaFinal(
            nomeLoja, corPrincipal, corTexto, instrucao, 
            agradecimento, tempo, whatsapp, metodos, logoBase64
        );
        
        zip.file("index.html", htmlFinal);
        
        if (logoBase64) {
            const imageData = logoBase64.split(',')[1];
            zip.file("logo.png", imageData, {base64: true});
        }
        
        mostrarProgresso(50, 'Compactando...');
        const zipBlob = await zip.generateAsync({type: "blob"});
        
        // Enviar para backend
        mostrarProgresso(70, 'Enviando site...');
        const formData = new FormData();
        formData.append('site', zipBlob, `paypro-${nomeLoja.toLowerCase().replace(/\s+/g, '-')}.zip`);
        formData.append('nomeLoja', nomeLoja);
        formData.append('whatsapp', whatsapp);
        formData.append('metodos', JSON.stringify(metodos));
        
        const resposta = await fetch(`${BACKEND_URL}/upload-site`, {
            method: 'POST',
            body: formData
        });
        
        if (!resposta.ok) throw new Error('Erro no servidor');
        
        const resultado = await resposta.json();
        
        mostrarProgresso(100, 'Enviado com sucesso!');
        
        btn.innerHTML = '<i class="fas fa-check"></i> Enviado com sucesso!';
        
        alert(`✅ SITE ENVIADO!\n\nLoja: ${nomeLoja}\n\nEm breve entraremos em contato pelo WhatsApp.`);
        
        esconderProgresso();
        
        setTimeout(() => {
            btn.innerHTML = textoOriginal;
            btn.disabled = false;
        }, 3000);
        
    } catch (error) {
        console.error("Erro:", error);
        
        document.getElementById('progressContainer').style.display = 'none';
        document.getElementById('progressText').style.display = 'none';
        
        alert("❌ Erro ao enviar. Tente novamente.");
        
        const btn = document.getElementById('btnEnviar');
        btn.innerHTML = '<i class="fas fa-cloud-upload-alt"></i> Enviar site para aprovação';
        btn.disabled = false;
    }
}

// =============================================
// GERAR PÁGINA FINAL (SIMPLES - só números copiáveis + formulário)
// =============================================
function gerarPaginaFinal(nomeLoja, corPrincipal, corTexto, instrucao, agradecimento, tempo, whatsapp, metodos, logoBase64) {
    
    // Função para criar card de método com número copiável
    function metodoCard(metodo, icone, cor, numero, titular, codigoUssd) {
        if (!metodo.ativo) return '';
        
        return `
        <div style="background: #f8fafc; border-radius: 16px; padding: 16px; margin-bottom: 16px; border: 1px solid #e2e8f0;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                <div style="width: 40px; height: 40px; background: ${cor === 'mpesa' ? '#00a85920' : '#ff6b0020'}; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: ${cor === 'mpesa' ? '#00a859' : '#ff6b00'};">
                    <i class="${icone}"></i>
                </div>
                <div>
                    <span style="font-weight: 700;">${metodo}</span>
                    <span style="background: #1e293b; color: white; padding: 2px 8px; border-radius: 20px; font-size: 11px; margin-left: 8px;">${codigoUssd}</span>
                </div>
            </div>
            
            <!-- Número copiável -->
            <div onclick="copiarNumero('${numero.replace(/\s+/g, '')}', '${titular}')" style="background: white; border-radius: 12px; padding: 12px; border: 1px solid #e2e8f0; cursor: pointer; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <div>
                    <div style="font-weight: 700; font-size: 16px;">${numero}</div>
                    <div style="font-size: 12px; color: #64748b;">${titular}</div>
                </div>
                <div style="color: #6366f1; background: #e0e7ff; width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-copy"></i>
                </div>
            </div>
            
            <!-- Botão pagar -->
            <button onclick="window.location.href='tel:*150%23'" style="width: 100%; background: #1e293b; color: white; border: none; padding: 14px; border-radius: 12px; font-weight: 600; cursor: pointer;">
                <i class="fas fa-phone-alt"></i> Pagar com ${metodo}
            </button>
        </div>
        `;
    }
    
    return `<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${nomeLoja} - Pagamento</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f5f5f5;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 500px;
            margin: 0 auto;
        }
        .card {
            background: white;
            border-radius: 24px;
            padding: 24px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .logo {
            width: 80px;
            height: 80px;
            background: #f0f0f0;
            border-radius: 16px;
            margin: 0 auto 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }
        .logo img { max-width: 100%; }
        .store-name {
            text-align: center;
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 8px;
        }
        .instruction {
            text-align: center;
            color: #666;
            font-size: 14px;
            margin-bottom: 24px;
        }
        .form-group {
            margin-bottom: 16px;
        }
        .form-control {
            width: 100%;
            padding: 14px;
            border: 1px solid #ddd;
            border-radius: 12px;
            font-size: 15px;
        }
        .file-area {
            border: 2px dashed #ddd;
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            cursor: pointer;
            margin-bottom: 16px;
        }
        .btn-whatsapp {
            width: 100%;
            background: #25D366;
            color: white;
            border: none;
            padding: 16px;
            border-radius: 50px;
            font-weight: 600;
            font-size: 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #666;
            font-size: 13px;
        }
        .toast {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #333;
            color: white;
            padding: 12px 24px;
            border-radius: 50px;
            font-size: 14px;
            display: none;
        }
        .toast.show { display: block; }
    </style>
</head>
<body>
    <div class="container">
        <div class="card">
            <!-- LOGO -->
            <div class="logo">
                ${logoBase64 ? '<img src="logo.png" alt="Logo">' : '<i class="fas fa-store" style="color: #999; font-size: 32px;"></i>'}
            </div>
            
            <h1 class="store-name">${nomeLoja}</h1>
            <div class="instruction">${instrucao}</div>
            
            <!-- M-PESA -->
            ${metodos.mpesa.ativo ? `
            <div style="background: #f8fafc; border-radius: 16px; padding: 16px; margin-bottom: 16px;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                    <div style="width: 40px; height: 40px; background: #00a85920; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #00a859;">
                        <i class="fas fa-mobile-alt"></i>
                    </div>
                    <span style="font-weight: 700;">M-PESA</span>
                    <span style="background: #1e293b; color: white; padding: 2px 8px; border-radius: 20px; font-size: 11px;">*150#</span>
                </div>
                
                <div onclick="copiarNumero('${metodos.mpesa.numero.replace(/\s+/g, '')}', '${metodos.mpesa.titular}')" style="background: white; border-radius: 12px; padding: 12px; border: 1px solid #ddd; cursor: pointer; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <div>
                        <div style="font-weight: 700;">${metodos.mpesa.numero}</div>
                        <div style="font-size: 12px; color: #666;">${metodos.mpesa.titular}</div>
                    </div>
                    <div style="color: #6366f1;"><i class="fas fa-copy"></i></div>
                </div>
                
                <button onclick="window.location.href='tel:*150%23'" style="width: 100%; background: #1e293b; color: white; border: none; padding: 14px; border-radius: 12px; font-weight: 600;">
                    <i class="fas fa-phone-alt"></i> Pagar com M-PESA
                </button>
            </div>
            ` : ''}
            
            <!-- E-MOLA -->
            ${metodos.emola.ativo ? `
            <div style="background: #f8fafc; border-radius: 16px; padding: 16px; margin-bottom: 16px;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                    <div style="width: 40px; height: 40px; background: #ff6b0020; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #ff6b00;">
                        <i class="fas fa-mobile-alt"></i>
                    </div>
                    <span style="font-weight: 700;">E-MOLA</span>
                    <span style="background: #1e293b; color: white; padding: 2px 8px; border-radius: 20px; font-size: 11px;">*898#</span>
                </div>
                
                <div onclick="copiarNumero('${metodos.emola.numero.replace(/\s+/g, '')}', '${metodos.emola.titular}')" style="background: white; border-radius: 12px; padding: 12px; border: 1px solid #ddd; cursor: pointer; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <div>
                        <div style="font-weight: 700;">${metodos.emola.numero}</div>
                        <div style="font-size: 12px; color: #666;">${metodos.emola.titular}</div>
                    </div>
                    <div style="color: #6366f1;"><i class="fas fa-copy"></i></div>
                </div>
                
                <button onclick="window.location.href='tel:*898%23'" style="width: 100%; background: #1e293b; color: white; border: none; padding: 14px; border-radius: 12px; font-weight: 600;">
                    <i class="fas fa-phone-alt"></i> Pagar com E-MOLA
                </button>
            </div>
            ` : ''}
            
            <!-- FORMULÁRIO -->
            <form id="formComprovativo" onsubmit="event.preventDefault()">
                <div class="form-group">
                    <input type="text" class="form-control" id="nomeCliente" placeholder="Seu nome" required>
                </div>
                <div class="form-group">
                    <input type="number" class="form-control" id="valorPago" placeholder="Valor pago (MT)" required>
                </div>
                <div class="file-area" onclick="document.getElementById('fileInput').click()">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p style="margin-top: 5px;">Clique para anexar o comprovativo</p>
                    <input type="file" id="fileInput" accept="image/*" style="display: none;" required>
                </div>
                
                <button type="button" class="btn-whatsapp" onclick="enviarComprovativo('${whatsapp}')">
                    <i class="fab fa-whatsapp"></i> Enviar comprovativo
                </button>
            </form>
            
            <div class="footer">
                <p>${agradecimento} Verificaremos em até ${tempo}.</p>
            </div>
        </div>
    </div>
    
    <div id="toast" class="toast"></div>
    
    <script>
        function copiarNumero(numero, titular) {
            navigator.clipboard.writeText(numero + ' (' + titular + ')');
            mostrarToast('✅ Número copiado');
        }
        
        function enviarComprovativo(numeroVendedor) {
            const nome = document.getElementById('nomeCliente').value || 'Cliente';
            const valor = document.getElementById('valorPago').value || 'Valor';
            const fileInput = document.getElementById('fileInput');
            
            if (!fileInput.files || fileInput.files.length === 0) {
                mostrarToast('❌ Anexe o comprovativo');
                return;
            }
            
            const msg = '🛒 PAGAMENTO\\nCliente: ' + nome + '\\nValor: ' + valor + ' MT';
            window.open('https://wa.me/' + numeroVendedor.replace('+', '') + '?text=' + encodeURIComponent(msg), '_blank');
        }
        
        function mostrarToast(msg) {
            const toast = document.getElementById('toast');
            toast.textContent = msg;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2000);
        }
    </script>
</body>
</html>`;
}

// =============================================
// INICIALIZAÇÃO
// =============================================
window.onload = function() {
    atualizarPreview();
    toggleMetodo('mpesa');
    toggleMetodo('emola');
    toggleMetodo('paypal');
    
    // Forçar atualização quando qualquer campo mudar
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', atualizarPreview);
        input.addEventListener('change', atualizarPreview);
    });
    
    console.log('✅ Painel PayPro carregado');
};
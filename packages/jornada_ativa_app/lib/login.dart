import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'escolhanivel.dart';

/// Tela de Login do aplicativo
/// Usuário insere email e senha para acessar o sistema
class Login extends StatefulWidget {
  const Login({super.key});

  @override
  State<Login> createState() => _LoginState();
}

class _LoginState extends State<Login> {
  // =============================
  // EXEMPLO DE AUTENTICAÇÃO FICTÍCIA
  // Substitua por sua chamada real à API!
  // Esta função simula uma requisição que retorna um usuário
  // com o campo "nivel" preenchido ou nulo.
  // Se o email contém "nivel", retorna um nível qualquer.
  // Caso contrário, retorna nivel nulo.
  // =============================
  Future<Map<String, dynamic>> autenticarUsuario(String email, String senha) async {
    // Aqui você deve fazer a requisição real para sua API
    // Exemplo:
    // final response = await http.post(
    //   Uri.parse('SUA_URL_API/login'),
    //   body: { 'email': email, 'senha': senha },
    // );
    // final usuario = jsonDecode(response.body);
    // return usuario;

    // Simulação fictícia:
    await Future.delayed(const Duration(seconds: 1));
    if (email.contains("nivel")) {
      return {"nivel": "Intermediário"};
    } else {
      return {"nivel": null};
    }
  }
  final _emailController = TextEditingController();
  final _senhaController = TextEditingController();
  bool _senhaVisivel = false;

  @override
  void dispose() {
    // Libera os controladores quando a tela for destruída
    _emailController.dispose();
    _senhaController.dispose();
    super.dispose();
  }

  /// Simula o login e navega para a tela de escolha de nível
  void _login() {
    final email = _emailController.text;
    final senha = _senhaController.text;

    // =============================
    // FLUXO DE LOGIN:
    // 1. Busca usuário na API
    // 2. Se "nivel" == null, leva para tela de escolha de nível
    // 3. Se "nivel" != null, leva para tela do usuário
    // =============================
    autenticarUsuario(email, senha).then((usuario) {
      if (usuario["nivel"] == null) {
        // Usuário sem nível definido, leva para tela de escolha de nível
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Escolha seu nível para continuar!")),
        );
        Navigator.pushNamed(context, '/escolhanivel');
      } else {
        // Usuário já tem nível, leva direto para tela do usuário
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text("Bem-vindo! Nível: ${usuario["nivel"]}")),
        );
        Navigator.pushNamed(context, '/telausuario');
      }
    }).catchError((_) {
      // Erro de autenticação ou requisição
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Usuário ou senha inválidos")),
      );
    });
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => FocusScope.of(context).unfocus(), // Fecha o teclado ao clicar fora
      child: Scaffold(
        backgroundColor: Colors.grey[200],
        body: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Align(
                    alignment: Alignment.centerLeft,
                    child: IconButton(
                      icon: const Icon(Icons.arrow_back),
                      onPressed: () => Navigator.pop(context),
                    ),
                  ),

                  // Logo do aplicativo
                  Center(
                    child: Image.asset(
                      'images/logo.png', // Caminho configurado no pubspec.yaml
                      height: 140,
                    ),
                  ),
                  const SizedBox(height: 40),

                  // Título "Log In"
                  Text(
                    'Log In',
                    style: GoogleFonts.interTight(
                      fontSize: 28,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 32),

                  // Campo de email
                  TextField(
                    controller: _emailController,
                    keyboardType: TextInputType.emailAddress,
                    decoration: InputDecoration(
                      labelText: "Email",
                      filled: true,
                      fillColor: Colors.white,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Campo de senha com visibilidade
                  TextField(
                    controller: _senhaController,
                    obscureText: !_senhaVisivel,
                    decoration: InputDecoration(
                      labelText: "Senha",
                      filled: true,
                      fillColor: Colors.white,
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      suffixIcon: IconButton(
                        icon: Icon(
                          _senhaVisivel
                              ? Icons.visibility
                              : Icons.visibility_off,
                        ),
                        onPressed: () {
                          setState(() {
                            _senhaVisivel = !_senhaVisivel;
                          });
                        },
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Botão "Entrar"
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFFF5B00),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                      onPressed: _login,
                      child: Text(
                        "Entrar",
                        style: GoogleFonts.interTight(
                          fontSize: 16,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Texto "Esqueceu a senha?"
                  Center(
                    child: GestureDetector(
                      onTap: () {
                        // ação de recuperar senha (futuramente)
                      },
                      child: Text(
                        "Esqueceu a senha?",
                        style: GoogleFonts.inter(
                          color: Colors.blue,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

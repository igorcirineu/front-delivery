import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AutenticacaoService } from 'src/app/services/autenticacao.service';
import { SessaoService } from 'src/app/services/sessao.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  hide = true;

  constructor(
    private formBuilder: FormBuilder,
    private autenticacaoService: AutenticacaoService,
    private sessaoService: SessaoService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]],
    });
  }

  async login(): Promise<void> {
    const email = this.loginForm.get('email')?.value;
    const senha = this.loginForm.get('senha')?.value;

    this.autenticacaoService.autenticar(email, senha).subscribe(
      (result) => {
        this.autenticacaoService.showMessage('O login foi efetuado com sucesso!');
        const role = this.sessaoService.setToken(result.token);
        // this.sessaoService.setRefreshToken(refresh_token);
        if (role === 'admin') this.router.navigate(['dashboard']);
        else this.router.navigate(['pedidos']);
      },
      (e) => {
        this.autenticacaoService.showMessage('Credenciais incorretas, tente novamente', true);
      },
    );
  }

  esqueciASenha(): void {
    this.router.navigate(['esqueceu-senha']);
  }
}

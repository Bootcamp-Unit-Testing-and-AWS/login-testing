import { LoginComponent } from './login.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';

describe('LoginComponent Test', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const userEmail = 'test@test.com';
  const userPassword = '#Clave1234';

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });
  it('Should create a component', () => {
    expect(component).toBeTruthy();
  });
  it('should register the user when using the login method', () => {
    //Arrange
    component.email = userEmail;
    component.password = userPassword;
    const mockTokenResponse = { token: '1231231+', msg: 'success' };

    authServiceSpy.login.and.returnValue(of(mockTokenResponse));
    //Act
    component.login();

    //Assert
    // Verifica que se haga el llamado del método al menos una vez con los parametros dados

    expect(authServiceSpy.login).toHaveBeenCalledWith(userEmail, userPassword);
    // Verificación de que el pop up fue lanzado
    expect(Swal.isVisible()).toBeTrue();
    // Verifica que si se navegó correctamente hacia la URL de csv-home
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/csv-home']);
  });
  it('Debería manejar errores inesperados al hacer el llamado de la api (del servicio)', () => {
    // Arrange
    const mockFailResponse = { error: { msg: 'error' } };
    authServiceSpy.login.and.returnValue(throwError(mockFailResponse));
    // Act
    component.login();
    // Assert
    expect(Swal.isVisible()).toBeTrue();
    expect(Swal.getTitle()?.textContent).toBe('Ups!!');
  });
});

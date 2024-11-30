import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RegisterComponent } from "./register.component"
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { of, throwError } from "rxjs";
import Swal from "sweetalert2";

describe('RegisterComponent Test', ()=>{
    let component : RegisterComponent;
    let fixture : ComponentFixture<RegisterComponent>;
    let authServiceSpy : jasmine.SpyObj<AuthService>;
    let routerSpy : jasmine.SpyObj<Router>;

    const userEmail = 'test@test.com';
    const userPassword = '#Clave1234';
    beforeEach( async()=>{
        const authSpy = jasmine.createSpyObj('AuthService',['register']);
        const routerSpyObj = jasmine.createSpyObj('Router',['navigate']);
        await TestBed.configureTestingModule({
            imports: [RegisterComponent],
            providers: [
                {provide: AuthService, useValue: authSpy},
                {provide: Router, useValue: routerSpyObj}
            ]
        }).compileComponents();
        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;
        authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        fixture.detectChanges();
    });

    it('Debería crear un componente', ()=>{
        expect(component).toBeTruthy();
    })

    // Caso de éxito - El usuario se registró correctamente
    it('Debería registrar al usuario al usar el método onSubmit', ()=>{
        // Arrange - Preparación
        component.email = userEmail;
        component.password = userPassword;
        const mockCorrectResponse = {ok: true, msg: 'Usuario registrado'};
        authServiceSpy.register.and.returnValue(of(mockCorrectResponse));
        // Act
        component.onSubmit(new Event('submit'));
        // Assert
        // Verifica que se haga el llamado del método al menos una vez con los parametros dados
        expect(authServiceSpy.register).toHaveBeenCalledWith(userEmail,userPassword);
        // Verificación de que el pop up fue lanzado
        expect(Swal.isVisible()).toBeTrue();
        // expect(Swal.isVisible()).toBeTruthy();
        // Verifica que si se navegó correctamente hacia la URL de login luego de registrarse
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    })

    it('Debería manejar el error al tener un response.ok en false desde el auth service en el register component', ()=>{
        // Arrange
        const mockErrorResponse = {ok: false, error: {msg: 'Error email ya registrado'}};
        authServiceSpy.register.and.returnValue(of(mockErrorResponse));
        // Act
        component.onSubmit(new Event('submit'));
        // Assert
        expect(Swal.isVisible()).toBeTrue();
        expect(Swal.getTitle()?.textContent).toBe('Algo salió mal en el backend');
    })

    it('Debería manejar errores inesperados al hacer el llamado de la api (del servicio)', ()=>{
        // Arrange
        const mockFailResponse = {error:{msg:'Internal Server Error'}};
        authServiceSpy.register.and.returnValue(throwError(mockFailResponse));
        // Act 
        component.onSubmit(new Event('submit'));
        // Assert
        expect(Swal.isVisible()).toBeTrue();
        expect(Swal.getTitle()?.textContent).toBe('Hubo un error al hacer la petición');
    })    

})
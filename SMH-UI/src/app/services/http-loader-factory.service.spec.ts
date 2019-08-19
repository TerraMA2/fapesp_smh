import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { RepositoryApi } from 'src/app/enums/repository-api.enum';


import { HttpLoaderFactoryService } from './http-loader-factory.service';

describe('Validar serviço HttpLoaderFactoryService', () => {

  // beforeEach(() => TestBed.configureTestingModule({}));

  // beforeEach( async(() => {
  //   TestBed.configureTestingModule({
  //     providers: [HttpLoaderFactoryService]
  //   }).compileComponents();
  // }));

  beforeEach(() => {
    // 0. set up the test environment
    TestBed.configureTestingModule({
      imports: [
        // no more boilerplate code w/ custom providers needed :-)
        HttpClientModule,
        HttpClientTestingModule
      ]
    });
  });

  it(`smh-api Validado`,
    async(
      inject([HttpClient, HttpTestingController], (http: HttpClient, backend: HttpTestingController) => {

        http.get(RepositoryApi.smh_api).subscribe();
        backend.expectOne({
          url: RepositoryApi.smh_api,
          method: 'GET'
        });
      })
    )
  );

  // it(`geoserverTerraMaApi Validado`,
  //   async(
  //     inject([HttpClient, HttpTestingController], (http: HttpClient, backend: HttpTestingController) => {

  //       http.get(RepositoryApi.geoserverTerraMaApi).subscribe();
  //       backend.expectOne({
  //         url: RepositoryApi.geoserverTerraMaApi,
  //         method: 'GET'
  //       });
  //     })
  //   )
  // );


  it(`geoserverTerraMaLocal Validado`,
  async(
    inject([HttpClient, HttpTestingController], (http: HttpClient, backend: HttpTestingController) => {

      http.get(RepositoryApi.geoserverTerraMaLocal).subscribe();
      backend.expectOne({
        url: RepositoryApi.geoserverTerraMaLocal,
        method: 'GET'
      });
    })
  )
);
  // it('should create the app', async(() => {
  //   expect(2 + 3).toEqual(4);
  // }));

  // it('Serviço HttpLoaderFactoryService e Válido', async(() => {
  //   const service: HttpLoaderFactoryService = TestBed.get(HttpLoaderFactoryService);
  //   expect(service.ResponseToURL("http://150.163.17.143:8181/smh-api/terrama/resources/")).toBeTruthy();
  // }));



  // describe(':', () => {
  //   let fixture, app;
  //   // Most test suites in this guide call beforeEach() to set the preconditions for each it()
  //   // test and rely on the TestBed to create classes and inject services.
  //   beforeEach(() => {
  //     fixture = TestBed.createComponent(HttpLoaderFactoryService);
  //     app = fixture.debugElement.componentInstance;
  //   });


  //   it('should create the app', async(() => {
  //     expect(2 + 2).toEqual(4);
  //   }));

  //   //   it('Serviço HttpLoaderFactoryService e Válido', async(() => {
  //   //   const service: HttpLoaderFactoryService = TestBed.get(HttpLoaderFactoryService);
  //   //   expect(service.ResponseToURL("http://150.163.17.143:8181/smh-api/terrama/resources/")).toBeTruthy();
  //   // }));

  //   // it('should create the app', async(() => {
  //   //   expect(app).toBeTruthy();
  //   // }));

  //   // it('should have title as \'Angular7-unit-testing!\'', async(() => {
  //   //   expect(app.title).toBe('Angular7-unit-testing!');
  //   // }));

  //   // it('should have h1 tag as \'Welcome Angulat7-unit-testing!\'', async(() => {
  //   //   fixture.detectChanges();
  //   //   const compile = fixture.debugElement.nativeElement;
  //   //   const h1tag = compile.querySelector('h1');
  //   //   expect(h1tag.textContent).toBe(' Welcome to Angular7-unit-testing!! ');
  //   // }));

  // });
});

  // afterEach(() => {

  //   // it('Serviço HttpLoaderFactoryService e Válido', async(() => {
  //   //   const service: HttpLoaderFactoryService = TestBed.get(HttpLoaderFactoryService);
  //   //   expect(service.ResponseToURL("http://150.163.17.143:8181/smh-api/terrama/resources/")).toBeTruthy();
  //   // }));

  // });

  // it('Serviço HttpLoaderFactoryService e Válido', async(() => {
  //   const service: HttpLoaderFactoryService = TestBed.get(HttpLoaderFactoryService);
  //   expect(service.ResponseToURL("http://150.163.17.143:8181/smh-api/terrama/resources/")).toBeTruthy();
  // }));

// });

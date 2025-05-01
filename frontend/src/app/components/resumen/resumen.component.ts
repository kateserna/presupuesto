import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, computed, effect, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
//import { AppConfigService } from '@/service/appconfigservice';
import { ChartModule } from 'primeng/chart';
import { TransaccionService } from '../../core/services/transaccion.service';
import { SharedService } from '../../core/services/shared.service';

interface Transaccion{
    id: number;
    usuario: string;
    fecha_creacion: Date;
    fecha_transaccion: Date;
    tipo: string;
    nombre_categoria: string;
    descripcion?: string; //opcional
    valor: number;
  }
  
@Component({
  selector: 'app-resumen',
  imports: [ChartModule],
  templateUrl: './resumen.component.html',
  styleUrl: './resumen.component.scss'
})
export class ResumenComponent implements OnInit {

    constructor(
        private cd: ChangeDetectorRef,
        private sharedService: SharedService,
        private transaccionService: TransaccionService
    ) {}

    email: string = ""
    listaActivos = signal<Transaccion[]>([]);
    basicData: any;
    basicOptions: any;
    

    //platformId = inject(PLATFORM_ID);

    //configService = inject(AppConfigService);

    

    // themeEffect = effect(() => {
    //     if (this.configService.transitionComplete()) {
    //         if (this.designerService.preset()) {
    //             this.initChart();
    //         }
    //     }
    // });

    ngOnInit() {
        this.email = this.sharedService.getEmail() ?? "";

        this.transaccionService.getAllActivos(this.email).subscribe((data:any) => {
            console.log("Datos recibidos del servicio: ", data);
            this.listaActivos.set(data.message); // Asegúrate de que `data.message` contenga un array válido
            console.log("listaActivos después de set: ", this.listaActivos());
            this.initChart(); // Llama a initChart después de cargar los datos
        });        
    }

    activos = computed(() => {
        const categoryTotals: { [key: string]: number } = {};
        this.listaActivos().forEach((transaccion) => {
            categoryTotals[transaccion.nombre_categoria] = 
            (categoryTotals[transaccion.nombre_categoria] || 0) + transaccion.valor;
            
        });
        console.log("categoryTotals: ", categoryTotals)
        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);
        console.log("labels: ", labels)
        console.log("data: ", data)
        return categoryTotals;

    })

    
    initChart() {
        //if (isPlatformBrowser(this.platformId)) {
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--p-text-color');
            const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
            const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

            const categoryTotals = this.activos();
            const labels = Object.keys(categoryTotals);
            const data = Object.values(categoryTotals);
            console.log("categoryTotals2: ", categoryTotals)
            console.log("labels2: ", labels)
            console.log("data2: ", data)

            if (labels.length === 0 || data.length === 0) {
                console.error("No hay datos para mostrar en el gráfico.");
                return;
            }

            this.basicData = {
                labels: labels,
                datasets: [
                    {
                        label: 'Activos',
                        data: data,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(255, 159, 64, 0.2)',
                            'rgba(255, 205, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(153, 102, 255, 0.2)',
                            'rgba(201, 203, 207, 0.2)'
                        ],
                        borderColor: [
                            'rgb(255, 99, 132)',
                            'rgb(255, 159, 64)',
                            'rgb(255, 205, 86)',
                            'rgb(75, 192, 192)',
                            'rgb(54, 162, 235)',
                            'rgb(153, 102, 255)',
                            'rgb(201, 203, 207)'
                        ],
                        borderWidth: 1,
                    },
                ],
            };

            this.basicOptions = {
                plugins: {
                    legend: {
                        labels: {
                            color: textColor,// Color del texto de la leyenda
                        },
                    },
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColorSecondary,// Color de las etiquetas del eje X
                        },
                        grid: {
                            color: surfaceBorder, // Color de las líneas de la cuadrícula
                        },
                    },
                    y: {
                        beginAtZero: true, // Comienza desde 0
                        ticks: {
                            color: textColorSecondary, // Color de las etiquetas del eje Y
                        },
                        grid: {
                            color: surfaceBorder, // Color de las líneas de la cuadrícula
                        },
                    },
                },
            };
            this.cd.markForCheck()
       // }
    }

}

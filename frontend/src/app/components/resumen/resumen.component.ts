import { ChangeDetectorRef, Component, computed, OnInit, signal } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { TransaccionService } from '../../core/services/transaccion.service';
import { SharedService } from '../../core/services/shared.service';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import { CommonModule } from '@angular/common';


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

//interface usada para la lista de despliegue
interface Opciones {
    name: string;
}
  
@Component({
  selector: 'app-resumen',
  imports: [
    ChartModule, 
    Select, 
    FormsModule, 
    CommonModule, 
    DatePicker, 
    FloatLabel
],
  templateUrl: './resumen.component.html',
  styleUrl: './resumen.component.scss'
})

export class ResumenComponent implements OnInit {

    constructor(
        private cd: ChangeDetectorRef, //usado en los graficos
        private sharedService: SharedService, //requerido para obtener el correo del usuario
        private transaccionService: TransaccionService //requerido para obtener la data de Activos, pasivos, ingresos y egresos
    ) {}

    // Variable fecha del selector inicializada con la fecha actual.
    date = signal(new Date());
    // Esta variable contiene la fecha maxima seleccionable para el selector de fecha en ingresos y egresos.
    maxDate: Date | undefined;

    email: string = "" // variable para correo del usuario
    listaActivos = signal<Transaccion[]>([]);
    listaPasivos = signal<Transaccion[]>([]);
    listaIngresos = signal<Transaccion[]>([]);
    listaEgresos = signal<Transaccion[]>([]);
    
    //data y opciones para gráficos de Activos
    dataBarActivos: any;
    optionsBarActivos: any;
    dataPieActivos: any;
    optionsPieActivos: any;

    //data y opciones para gráficos de Pasivos
    dataBarPasivos: any;
    optionsBarPasivos: any;
    dataPiePasivos: any;
    optionsPiePasivos: any;

    //data y opciones para gráficos de Ingresos
    dataBarIngresos: any;
    optionsBarIngresos: any;
    dataPieIngresos: any;
    optionsPieIngresos: any;

    //data y opciones para gráficos de Egresos
    dataBarEgresos: any;
    optionsBarEgresos: any;
    dataPieEgresos: any;
    optionsPieEgresos: any;

    //Lista desplegable: Activos, Pasivos, Ingresos, Egresos
    seccion: Opciones[] | undefined;
    tipoSeccion: Opciones | undefined;

    ngOnInit() {
        this.email = this.sharedService.getEmail() ?? "";
        this.date.set(new Date());
        this.maxDate = new Date();

        //opciones de sección:
        this.seccion = [
            { name: 'activos' },
            { name: 'pasivos' },
            { name: 'ingresos' },
            { name: 'egresos' },
        ];

        this.transaccionService.getAllActivos(this.email).subscribe((data:any) => {
            this.listaActivos.set(data.message); // Datos recibidos del servicio, asegurarse de que `data.message` contenga un array válido
            this.initChartActivosBarras(); // Llama a initChart después de cargar los datos
            this.initChartActivosPie();
        }); 

        this.transaccionService.getAllPasivos(this.email).subscribe((data:any) => {
            this.listaPasivos.set(data.message); // Datos recibidos del servicio, asegurarse de que `data.message` contenga un array válido
            this.initChartPasivosBarras(); // Llama a initChart después de cargar los datos
            this.initChartPasivosPie();
        });

        this.transaccionService.getAllIngresos(this.email).subscribe((data:any) => {
            this.listaIngresos.set(data.message); // Datos recibidos del servicio, asegurarse de que `data.message` contenga un array válido
             
        });

        this.transaccionService.getAllEgresos(this.email).subscribe((data:any) => {
            this.listaEgresos.set(data.message); // Datos recibidos del servicio, asegurarse de que `data.message` contenga un array válido
        });
    }

    //Setear la fecha para filtrar la data por mes
    filterMonth(dateMonth: Date){
        this.date.set(dateMonth);
        // Llama a initChart después de cargar los datos filtrados
        this.initChartIngresosBarras(); 
        this.initChartIngresosPie();
        this.initChartEgresosBarras();
        this.initChartEgresosPie();
    }

    // --------------------------- Grficos Activos ---------------------------
    activos = computed(() => {
        const categoryTotals: { [key: string]: number } = {};
        this.listaActivos().forEach((transaccion) => {
            categoryTotals[transaccion.nombre_categoria] = 
            (categoryTotals[transaccion.nombre_categoria] || 0) + transaccion.valor;
        });
        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);
        return categoryTotals;
    })
    
    initChartActivosBarras() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--p-text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
        const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

        const categoryTotals = this.activos();
        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);

        if (labels.length === 0 || data.length === 0) {
            console.error("No hay datos para mostrar en el gráfico.");
            return;
        }

        this.dataBarActivos = {
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

        this.optionsBarActivos = {
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
    }

    initChartActivosPie() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        const categoryTotals = this.activos();
        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);

        this.dataPieActivos = {
            labels: labels,
            datasets: [
                {
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 205, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(201, 203, 207, 0.2)'],
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
                    hoverBackgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(255, 159, 64, 0.5)',
                        'rgba(255, 205, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(153, 102, 255, 0.5)',
                        'rgba(201, 203, 207, 0.5)'
                        ]
                }
            ]
        };

        this.optionsPieActivos = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        };
        this.cd.markForCheck()
    }

    // --------------------------- Grficos Pasivos ---------------------------

    pasivos = computed(() => {
        const categoryTotals: { [key: string]: number } = {};
        this.listaPasivos().forEach((transaccion) => {
            categoryTotals[transaccion.nombre_categoria] = 
            (categoryTotals[transaccion.nombre_categoria] || 0) + transaccion.valor;
            
        });
        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);
        return categoryTotals;
    })

    initChartPasivosBarras(){
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--p-text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
        const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

        const categoryTotals = this.pasivos();
        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);

        if (labels.length === 0 || data.length === 0) {
            console.error("No hay datos para mostrar en el gráfico.");
            return;
        }

        this.dataBarPasivos = {
            labels: labels,
            datasets: [
                {
                    label: 'Pasivos',
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

        this.optionsBarPasivos = {
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
    }

    initChartPasivosPie() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        const categoryTotals = this.pasivos();
        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);

        this.dataPiePasivos= {
            labels: labels,
            datasets: [
                {
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 205, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(201, 203, 207, 0.2)'],
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
                    hoverBackgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(255, 159, 64, 0.5)',
                        'rgba(255, 205, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(153, 102, 255, 0.5)',
                        'rgba(201, 203, 207, 0.5)'
                        ]
                }
            ]
        };

        this.optionsPiePasivos= {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        };
        this.cd.markForCheck()

    }
    
    // --------------------------- Grficos Ingresos ---------------------------

    ingresos = computed(() => {
        const categoryTotals: { [key: string]: number } = {};
        this.listaIngresos().forEach((transaccion) => {
            //filtro por mes de la data antes de mostrarse en el grafico
            const transactionDate = new Date(transaccion.fecha_transaccion);
            if (transactionDate.getFullYear() === this.date().getFullYear() &&
                transactionDate.getMonth() === this.date().getMonth()) {
                    categoryTotals[transaccion.nombre_categoria] = 
                    (categoryTotals[transaccion.nombre_categoria] || 0) + transaccion.valor;
            }
        });
        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);
        return categoryTotals;
    })

    initChartIngresosBarras(){
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--p-text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
        const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

        const categoryTotals = this.ingresos();
        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);
       
        this.dataBarIngresos = {
            labels: labels,
            datasets: [
                {
                    label: 'Ingresos',
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

        this.optionsBarIngresos = {
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
    }

    initChartIngresosPie() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        const categoryTotals = this.ingresos();
        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);

        this.dataPieIngresos= {
            labels: labels,
            datasets: [
                {
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 205, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(201, 203, 207, 0.2)'],
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
                    hoverBackgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(255, 159, 64, 0.5)',
                        'rgba(255, 205, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(153, 102, 255, 0.5)',
                        'rgba(201, 203, 207, 0.5)'
                        ]
                }
            ]
        };

        this.optionsPieIngresos= {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        };
        this.cd.markForCheck()

    }
    
    // --------------------------- Grficos Egresos ---------------------------
    egresos = computed(() => {
        const categoryTotals: { [key: string]: number } = {};
        this.listaEgresos().forEach((transaccion) => {
            //filtro por mes de la data antes de mostrarse en el grafico
            const transactionDate = new Date(transaccion.fecha_transaccion);
            if (transactionDate.getFullYear() === this.date().getFullYear() &&
                transactionDate.getMonth() === this.date().getMonth()) {
                    categoryTotals[transaccion.nombre_categoria] = 
                    (categoryTotals[transaccion.nombre_categoria] || 0) + transaccion.valor;
            }
        });
        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);
        return categoryTotals;

    })

    initChartEgresosBarras(){
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--p-text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
        const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

        const categoryTotals = this.egresos();
        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);
        
        this.dataBarEgresos = {
            labels: labels,
            datasets: [
                {
                    label: 'Egresos',
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

        this.optionsBarEgresos = {
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
    }

    initChartEgresosPie() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');

        const categoryTotals = this.egresos();
        const labels = Object.keys(categoryTotals);
        const data = Object.values(categoryTotals);

        this.dataPieEgresos= {
            labels: labels,
            datasets: [
                {
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(255, 159, 64, 0.2)',
                        'rgba(255, 205, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(201, 203, 207, 0.2)'],
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
                    hoverBackgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(255, 159, 64, 0.5)',
                        'rgba(255, 205, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(153, 102, 255, 0.5)',
                        'rgba(201, 203, 207, 0.5)'
                        ]
                }
            ]
        };

        this.optionsPieEgresos= {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        };
        this.cd.markForCheck()

    }
}
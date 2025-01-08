import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import * as echarts from 'echarts';
import { TranslationService } from '../shared/translation.service';

@Component({
  selector: 'fp-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: false
})
export class DashboardComponent implements OnInit {
  purchasedProducts: any[] = [];
  noPurchasedProducts: any[] = [];
  chartInstance: any;

  constructor(private dashboardService: DashboardService, public translationService: TranslationService) {}

  ngOnInit(): void {
    this.dashboardService.getPurchasedProducts().subscribe(products => {
      this.purchasedProducts = products;
      this.initChart();
    });

    this.dashboardService.getNoPurchasedProducts().subscribe(products => {
      this.noPurchasedProducts = products;
    });

    this.translationService.getLanguageChangeObservable().subscribe(() => {
      this.updateChartTitle();
    });
  }

  initChart(): void {
    const chartDom = document.getElementById('main')!;
    this.chartInstance = echarts.init(chartDom);
    this.updateChartTitle();
  }

  updateChartTitle(): void {
    if (this.purchasedProducts.length > 0) {
      const option = {
        title: {
          text: this.translationService.translate('dashboardComponent', 'mostPurchasedProducts')
        },
        tooltip: {},
        xAxis: {
          type: 'category',
          data: this.purchasedProducts.map(product => product.productName)
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Purchased',
            type: 'bar',
            data: this.purchasedProducts.map(product => product.purchased)
          }
        ]
      };
      this.chartInstance.setOption(option);
    } else {
      const option = {
        title: {
          text: this.translationService.translate('dashboardComponent', 'noPurchasedProducts')
        },
        series: [
          {
            type: 'pie',
            data: [
              { value: 1, name: this.translationService.translate('dashboardComponent', 'noPurchasedProducts'), itemStyle: { color: 'red' } }
            ]
          }
        ]
      };
      this.chartInstance.setOption(option);
    }
  }
}
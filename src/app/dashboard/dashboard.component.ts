import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';
import * as echarts from 'echarts';

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

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getPurchasedProducts().subscribe(products => {
      this.purchasedProducts = products;
      this.initChart();
    });

    this.dashboardService.getNoPurchasedProducts().subscribe(products => {
      this.noPurchasedProducts = products;
    });
  }

  initChart(): void {
    const chartDom = document.getElementById('main')!;
    this.chartInstance = echarts.init(chartDom);

    if (this.purchasedProducts.length > 0) {
      const option = {
        title: {
          text: 'Most Purchased Products'
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
            data: this.purchasedProducts.map(product => product.Purchased)
          }
        ]
      };
      this.chartInstance.setOption(option);
    } else {
      const option = {
        title: {
          text: 'No Purchased Products'
        },
        series: [
          {
            type: 'pie',
            data: [
              { value: 1, name: 'No Purchased Products', itemStyle: { color: 'red' } }
            ]
          }
        ]
      };
      this.chartInstance.setOption(option);
    }
  }
}
import {Component, OnInit} from '@angular/core';
import {ProductService} from "../../../shared/services/product.service";
import {ProductType} from "../../../../types/product.type";
import {CategoryService} from "../../../shared/services/category.service";
import {CategoryType} from "../../../../types/category.type";
import {CategoryWithTypeType} from "../../../../types/category-with-type.type";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveParamsUtils} from "../../../shared/utils/active-params.utils";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {AppliedFilterType} from "../../../../types/applied-filter.type";
import {debounceTime} from "rxjs";

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  products: ProductType[] = [];
  categoriesWithTypes: CategoryWithTypeType[] = [];
  activeParams: ActiveParamsType = {types: []};
  appliedFilters: AppliedFilterType[] = [];
  sortingOpen = false;
  sortingOptions: { name: string, value: string }[] = [
    {name: 'От А до Я', value: 'az-asc'},
    {name: 'От Я до А', value: 'az-desc'},
    {name: 'По возрастанию', value: 'price-asc'},
    {name: 'По убыванию цены', value: 'price-desc'}
  ];
  pages: number[] = [];

  constructor(private productService: ProductService,
              private categoryService: CategoryService,
              private activatedRoute: ActivatedRoute,
              private router: Router,) {

  }

  ngOnInit(): void {
    this.categoryService.getCategoriesWithTypes()
      .subscribe(data => {
        this.categoriesWithTypes = data;
      })



    this.activatedRoute.queryParams
      .pipe(
        debounceTime(500),
      )
      .subscribe((params) => {
      this.activeParams = ActiveParamsUtils.processParams(params);

      this.appliedFilters = [];
      this.activeParams.types.forEach(url => {

        for (let i = 0; i < this.categoriesWithTypes.length; i++) {
          const foundType = this.categoriesWithTypes[i].types.find(type => type.url === url);
          if (foundType) {
            this.appliedFilters.push({
              name: foundType.name,
              urlParam: foundType.url
            });
          }
        }
      });

      if (this.activeParams.heightFrom) {
        this.appliedFilters.push({
          name: 'Высота: от ' + this.activeParams.heightFrom + ' см',
          urlParam: 'heightFrom'
        });
      }
      if (this.activeParams.heightTo) {
        this.appliedFilters.push({
          name: 'Высота: до ' + this.activeParams.heightTo + ' см',
          urlParam: 'heightTo'
        });
      }
      if (this.activeParams.diameterFrom) {
        this.appliedFilters.push({
          name: 'Диаметр: от ' + this.activeParams.diameterFrom + ' см',
          urlParam: 'diameterFrom'
        });
      }
      if (this.activeParams.diameterTo) {
        this.appliedFilters.push({
          name: 'Диаметр: до ' + this.activeParams.diameterTo + ' см',
          urlParam: 'diameterTo'
        });
      }
      this.productService.getProducts(this.activeParams)
        .subscribe(data => {
          this.products = data.items;

          this.pages = [];
          for (let i = 1; i <= data.pages; i++) {
            this.pages.push(i);
          }
        });

    });
  }


  removeAppliedFilter(appliedFilter: AppliedFilterType) {
    if (appliedFilter.urlParam === 'heightFrom' ||
      appliedFilter.urlParam === 'heightTo' ||
      appliedFilter.urlParam === 'diameterFrom' ||
      appliedFilter.urlParam === 'diameterTo') {
      delete this.activeParams[appliedFilter.urlParam];
    } else {
      this.activeParams.types = this.activeParams.types.filter(item => item !== appliedFilter.urlParam);
    }

    this.activeParams.page = 1;
    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams,
    });
  }

  toggleSorting() {
    this.sortingOpen = !this.sortingOpen;
  }

  sort(value: string) {
    this.activeParams.sort = value;

    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams,
    });
  }

  openPage(page: number) {
    this.activeParams.page = page;
    this.router.navigate(['/catalog'], {
      queryParams: this.activeParams,
    });
  }

  openPrevPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/catalog'], {
        queryParams: this.activeParams,
      });
    }
  }

  openNextPage() {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
      this.router.navigate(['/catalog'], {
        queryParams: this.activeParams,
      });
    }
  }

}

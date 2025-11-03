import { Component, OnInit, OnDestroy } from '@angular/core';
import { FavoriteService } from '../../../shared/services/favorite.service';
import { FavoriteType } from '../../../../types/favorite.type';
import { DefaultResponseType } from '../../../../types/default-response.type';
import { environment } from '../../../../environments/environment';
import { CartService } from '../../../shared/services/cart.service';
import { CartType } from '../../../../types/cart.type';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss']
})
export class FavoriteComponent implements OnInit, OnDestroy {
  products: FavoriteType[] = [];
  serverStaticPath = environment.serverStaticPath;
  count: number = 1;
  private cartSubscription!: Subscription;

  constructor(
    private favoriteService: FavoriteService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.cartService.getCart().subscribe((cartData: CartType | DefaultResponseType) => {
      if ((cartData as DefaultResponseType).error !== undefined) {
        console.warn('Ошибка при получении корзины');
        return;
      }
      const cart = cartData as CartType;

      this.favoriteService.getFavorites().subscribe((data: FavoriteType[] | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        const favorites = data as FavoriteType[];

        this.products = favorites.map(product => {
          const cartItem = cart.items.find(item => item.product.id === product.id);
          if (cartItem) {
            product.isInCart = true;
            product.countInCart = cartItem.quantity;
          } else {
            product.isInCart = false;
            product.countInCart = 0;
          }
          return product;
        });
      });
    });

    this.cartSubscription = this.cartService.count$.subscribe(() => {
      this.syncWithCart();
    });
  }

  private syncWithCart() {
    this.cartService.getCart().subscribe((cartData: CartType | DefaultResponseType) => {
      if ((cartData as DefaultResponseType).error !== undefined) {
        return;
      }
      const cart = cartData as CartType;

      this.products.forEach(product => {
        const cartItem = cart.items.find(item => item.product.id === product.id);
        if (cartItem) {
          product.isInCart = true;
          product.countInCart = cartItem.quantity;
        } else {
          product.isInCart = false;
          product.countInCart = 0;
        }
      });
    });
  }

  addToCart(product: FavoriteType) {
    this.cartService.updateCart(product.id, this.count)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        product.isInCart = true;
        product.countInCart = this.count;
      });
  }

  updateCount(product: FavoriteType, value: number) {
    this.cartService.updateCart(product.id, value)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        product.countInCart = value;
      });
  }

  removeFromCart(product: FavoriteType) {
    this.cartService.updateCart(product.id, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }
        product.isInCart = false;
        product.countInCart = 0;
      });
  }

  removeFromFavorites(id: string) {
    this.favoriteService.removeFavorites(id)
      .subscribe((data: DefaultResponseType) => {
        if (data.error) throw new Error(data.message);
        this.products = this.products.filter(item => item.id !== id);
      });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}

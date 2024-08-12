import {
  Component,
  OnDestroy,
  inject,
  signal,
  effect,
  DestroyRef,
} from '@angular/core';
import { Subject, interval, of, Observable } from 'rxjs';
import { takeUntil, switchMap, map } from 'rxjs/operators';
import { AsyncPipe, NgIf, NgFor } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-teardown',
  standalone: true,
  templateUrl: './teardown.component.html',
  styleUrls: ['./teardown.component.sass'],
  imports: [NgIf, AsyncPipe, NgFor],
})
export class TeardownComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();
  private readonly masterSub = new Subject<void>();
  private readonly destroyRef = inject(DestroyRef);

  public intervalData$: Observable<string> = interval(1000).pipe(
    map((value) => `Interval Data: ${value}`),
    takeUntil(this.destroy$)
  );

  public asyncData$: Observable<string> = of('Data loaded').pipe(
    switchMap(() =>
      interval(1000).pipe(
        map((value) => `Async Data: ${value}`),
        takeUntilDestroyed(this.destroyRef)
      )
    )
  );

  public masterData$: Observable<string> = interval(1000).pipe(
    switchMap((value) => of(`Master Data: ${value}`))
  );

  public asyncDataFromPipe$: Observable<string> = interval(1000).pipe(
    switchMap((value) => of(`Async Pipe Data: ${value}`))
  );

  public readonly mySignal = signal<string>('Signal Data');
  private readonly signalData$ = interval(1000).pipe(
    map((value) => `Signal Data: ${value}`)
  );

  constructor() {
    // Signals effect
    effect(() => {
      console.log(this.mySignal());
    });
  }

  ngOnDestroy() {
    // Use takeUntil strategy
    this.destroy$.next();
    this.destroy$.complete();

    // Use masterSub.unsubscribe()
    this.masterSub.unsubscribe();
  }

  destroyIntervalData() {
    this.destroy$.next();
    this.destroy$.complete();
    this.intervalData$ = of('Interval Data has been destroyed'); // Fallback observable
  }

  recreateIntervalData() {
    const newDestroy$ = new Subject<void>();
    this.intervalData$ = interval(1000).pipe(
      map((value) => `Interval Data: ${value}`),
      takeUntil(newDestroy$)
    );
  }

  destroyAsyncData() {
    this.asyncData$ = of('Async Data has been destroyed'); // Fallback observable
  }

  recreateAsyncData() {
    this.asyncData$ = of('Data loaded').pipe(
      switchMap(() =>
        interval(1000).pipe(
          map((value) => `Async Data: ${value}`),
          takeUntilDestroyed(this.destroyRef)
        )
      )
    );
  }

  destroyMasterData() {
    this.masterSub.unsubscribe();
    this.masterData$ = of('Master Data has been destroyed'); // Fallback observable
  }

  recreateMasterData() {
    const newMasterSub = new Subject<void>();
    this.masterData$ = interval(1000).pipe(
      switchMap((value) => of(`Master Data: ${value}`))
    );
  }

  destroyAsyncPipeData() {
    this.asyncDataFromPipe$ = of('Async Pipe Data has been destroyed'); // Fallback observable
  }

  recreateAsyncPipeData() {
    this.asyncDataFromPipe$ = interval(1000).pipe(
      switchMap((value) => of(`Async Pipe Data: ${value}`))
    );
  }

  destroySignalData() {
    this.mySignal.set(''); // Resets signal value
  }

  recreateSignalData() {
    this.mySignal.set('Signal Data');
  }
}

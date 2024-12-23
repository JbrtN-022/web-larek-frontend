# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Архитектура приложения
Код приложения web-larek разделен на три слоя:

слой `model` - отвечает за хранение и изменение всех данных;
слой представления `view` - отвечает за отображение данных на странице;
слой `presenter` - отвечает за связь model и view слоев.
Слоем представлением будет тот код, который находится в файле `src\index.ts`, поскольку приложения небольшое.

Используется событийно-ориентированный подход с использованием `EventEmitter`.

## Базовый код
### Класс `Api`:

Содержит в себе базовую логику отправки запросов на сервер. В конструктор передается базовый адрес сервера и опциональный объект с заголовком запроса. Конструктор принимает

Методы класса:

* `get(url:string) `- выполняет `GET` запрос на переданный в параметрах адрес и возвращает промис с объектом, который вернул сервер;
* `post(url: string, data: object, method: ApiPostMethods = 'POST')` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на адрес переданный как параметр при вызове метода. По умолчанию выполняется POST запрос, но метод запроса может быть переопределен заданием третьего параметра вызова.
* `handleResponse(response: Response): Promise<object>` - Обрабатывает ответ сервера

### Класс `myApi`:

Класс наследует Api и имплементируент интерфейс IApi. Этот класс предназначен для взаимодействия с API, обеспечивая методы для получения данных о товарах и размещения заказов. В конструкторе задает базовый URL и параметры запроса.
### Поля класса:

* `cdn` - url-адрес, используемый для получения товаров.
Методы класса:

* `getCardItem` - Получает данные о товаре по его идентификатору.
* `getCardList` - Получает список всех товаров.
* `orderItems` - Отправляет данные о заказе на сервер и возвращает результат заказа.

### Класс `EventEmitter`:

Классическая реализация брокера событий. Он позволяет генерировать и подписываться на события, происходящие в приложении. Класс используется в презентере для обработки событий, а в слоях модели и представления для генерации событий.

### Методы класса описаны интерфейсом IEvents:

* `on(event: string, listener: Function)` - Установить обработчик на событие;
* `emit(event: string, data?: any)` - Инициировать событие с данными;
* `trigger(eventName:string, context?: Partial<any>)` - Сделать коллбек триггер, генерирующий событие при вызове;
* `off(event: string, listener: Function)` - Снять обработчик с события;
* `onAll(listener:Function)` - Слушать все события;
* `ofAll()` - Сбросить все обработчики.

### Класс `Component<T>`:

Абстрактный класс предназначен для упрощения работы с DOM в дочерних компонентах пользовательского интерфейса. Класс предоставляет общий инструментарий для изменения элементов интерфейса, таких как добавление/удаление классов, управление состоянием отображения, изменение текста, и установка изображений. Класс относится к слою View и служит базой для создания компонентов с унифицированными методами манипуляции DOM-элементами.

Методы класса:

* `toggleClass(element: HTMLElement, className: string, force?: boolean)` - Переключает CSS-класс на заданном элементе. Принимает HTMLElement, на котором переключается класс, имя класса для переключения и опционально булево значение принудительного управления;
* `setText(element: HTMLElement, value: unknown)` - Устанавливает текстовое содержимое элемента. Принимает HTMLElement, в котором изменяется текст и значение, которое будет установлено;
* `setDisable(element: HTMLElement, state: boolean)` - Изменяет статус блокировки элемента, делая его доступным или недоступным. Принимает HTMLElement, у которого изменяется атрибут disabled и булево значение, в которое нужно перевести статус блокировки;
* `setHidden(element: HTMLElement)` - Скрывает элемент, устанавливая стиль display: none. Принимает HTMLElement, который нужно скрыть;
* `setVisible(element: HTMLElement)` - Оторбажает элемент, удаляя стиль display. Принимает HTMLElement, который нужно отобразить;
* `setImage(element: HTMLImageElement, src: string, alt?: string)` - Устанавливает изображение и альтернативный текст для элемента <img>. Принимает HTMLImageElement, в котором устанавливается изображение, путь к изображению и опционально альтернативный текст изображения;
* `render(data?: Partial<T>)` - Возвращает корневой DOM-элемент компонента. Опционально принимает объект данных для обновления состояния компонента. Возвращает HTMLElement.


### Класс `Model<T>`:

Абстрактный класс `Model<T>` предназначен для управления данными и обработки событий в приложении. Этот класс относится к слою Model и предоставляет базовый метод для инициализации данных модели и уведомления других компонентов об изменениях с помощью `EventEmitter`.

Конструктор класса создает новый экземпляр модели с указанными данными и событиями, которые реализуют интерфейс `IEvents`. Принимает начальные данные модели и экземпляр для работы с событиями.

### Методы класса:

* `emitChanges(event: string, payload?: object)` - Отправляет событие об изменении модели, позволяя другим компонентам отслеживать обновления данных.

## Слой Model

### Класс AppData:

Класс AppData расширяет функционал `Model<IAppState>` и используется для управления состоянием всего приложения. Он хранит данные каталога, корзины, информации о заказе и ошибок формы. Класс предоставляет методы для управления состоянием каталога, корзины, предварительного просмотра товара, а также для обработки и валидации заказа.

### Методы класса:

* `toggleBasketState` - Добавляет или удаляет товар из корзины, в зависимости от его текущего состояния при помощи методов addToBasket и removeFromBusket.
* `addToBasket(productId: number)` - добавить товар в корзниу.
* `removeFromBasket(productId: number)` - удалить товар из корзины.
* `clearBasket` - Очищает корзину.
* `clearOrderState` - Очищает данные заказа.
* `getTotalPrice` - Рассчитывает и возвращает общую стоимость товаров в корзине.
* `setCatalog` - Добавляет массив товаров в каталог и отправляет событие об изменении каталога.
* `setPreview` - Устанавливает идентификатор выбранного товара для предварительного просмотра и отправляет событие об изменении.
* `setOrderFields` - Метод для заполнения полей email, phone, address, payment в order.
* `setOrderPayment` - устанавливает тип оплаты.
* `setOrderAddress` - устанавливает адрес доставки.
* `setOrderPhone` - устанавливает значение номера телефона.
* `setOrderEmail` - устанавливает значение имайла.
* `setBasketToOrder` - добавляет товары и сумму из корзины в заказ.
* `validateOrder` - Метод для проверки полей формы заказа.

## Слой View
### Класс Page:

Класс `Page` - представляет интерфейс главной страницы приложения, позволяет управлять основными элементами интерфейса, а именно: счетчиком корзины, каталогом товаров и блокировкой прокрутки. Наследует базовый класс `Component<IPage>`. В конструкторе принимается корневой элемент страницы HTMLElement, обьект для управления событиями, имплеметирующий интерфейс IEvents, инициализируется конструктор родительского класса.

### Поля класса:

* `_counter` - DOM-элемент, отображающий количество товаров в корзине.
* `_gallery` - DOM-элемент, представляющий галерею товаров на странице.
* `_wrapper` - DOM-элемент, оборачивающий всю страницу, используется для блокировки интерфейса.
* `_basket` - DOM-элемент, представляющий корзину, с возможностью открытия по клику.
#### Методы класса:

* `renderPageContent(content: HTMLElement): void` - отображает основной контент страницы.
* `updateBasketCounter(count: number): void` - обновляет счётчик корзины.
* `scrollToTop(): void` - прокручивает страницу наверх.

### Класс `Form`:

Класс Form представляет собой компонент формы, отвечающий за управление ее поведением и отображением. Он связывает элементы формы с событиями, которые обрабатываются с использованием интерфейса событий `IEvents`, и позволяет управлять валидацией и отображением ошибок. Наследует класс `Component<IForm>`

### Методы класса:

* `content` - Устанавливает новое содержимое модального окна.
* `open` - Открывает модальное окно.
* `close` - Закрывает модальное окно.
* `render` - Отрисовывает модальное окно с переданными данными, вызывая метод open для отображения окна.
### Класс Order:

Класс наследует `Form<IOrder>`. Он реализует взаимодействие пользователя с элементами выбора оплаты и адреса. В конструкторе инициализирует форму, поля адреса и кнопки выбора способа оплаты, добавляя обработчики событий на кнопки для выбора способа оплаты.

### Поля класса:

* `_address` - Поле ввода адреса доставки, где пользователь указывает место доставки заказа.
* `buttonNal` - Кнопка для выбора оплаты наличными.
* `buttonOnline` - Кнопка для выбора онлайн-оплаты.
### Методы класса:

* `address` - Устанавливает значение адреса доставки.
* `togglePayButton` - Активирует выбранную кнопку способа оплаты.
* `clearPayButton` - Очищает активное состояние для всех кнопок выбора способа оплаты.

### Класс `Contacts`:

Класс наследует `Form<IOrder>`. предоставляет интерфейс для ввода контактных данных и управления событиями, связанными с этими данными. В Конструкторе Инициализирует форму, устанавливает ссылки на элементы ввода для электронной почты и номера телефона.

### Поля класса:

* `contactElement: HTMLElement` - элемент формы контактов.
* `fields: { email: HTMLInputElement; phone: HTMLInputElement } `- поля для ввода контактных данных.

### Методы класса:

* `validateContacts(data: ContactData): boolean` - проверяет корректность контактной информации.
* `getContactData(): ContactData` - возвращает введённые данные.
* `onChange(callback: (data: ContactData) => void): void` - добавляет обработчик изменения данных.

### Класс `BasketCard`:

Класс `BasketCard` расшеряет Card и используется для отображения карточки товара в корзине покупок, включая индекс товара, его название, цену и кнопку для удаления из корзины.

### Поля класса:

* `basketElement: HTMLElement` - элемент корзины.
* `items: Product[] `- текущий список товаров в корзине.
* `totalPriceElement: HTMLElement `- элемент для отображения общей стоимости.
### Методы класса:

* `renderBasketItems(items: Product[]): void` - отображает список товаров в корзине.
* `updateTotalPrice(price: number): void `- обновляет общую стоимость товаров.
* `clearBasket(): void` - очищает корзину.

### Класс `Success`:

Класс наследует` Component<ISuccess>`. Он управляет отображением состояния успешного заказа. 

### Поля класса:

* `successElement: HTMLElement` - элемент для отображения сообщения.
* `messageElement: HTMLElement` - элемент для текста сообщения.

### Методы класса:

* `showSuccessMessage(message: string): void` - отображает сообщение об успехе.
* `hideMessage(): void `- скрывает сообщение.

### Класс Basket:

Класс Basket наследует `Component<IBasket>` представляет компонент корзины, отображая список добавленных товаров и общую сумму. В конструкторе инициализирует компонент, устанавливает ссылки на элементы списка, общей суммы и кнопки. Также добавляет обработчик событий для кнопки, который инициирует оформление заказа.

### Поля класса:

* `basketElement: HTMLElement` - элемент корзины.
* `items: Product[] `- текущий список товаров в корзине.
* `totalPriceElement: HTMLElement `- элемент для отображения общей стоимости.
### Методы класса:

* `renderBasketItems(items: Product[]): void` - отображает список товаров в корзине.
* `updateTotalPrice(price: number): void `- обновляет общую стоимость товаров.
* `clearBasket(): void` - очищает корзину.

### Класс `Card`:

Класс наследует `Component<ICard>`. Отображает основные характеристики карточки товара, такие как название, цена, изображение, категория и описание. В конструкторе инициализирует карточку товара, устанавливая ссылки на необходимые элементы DOM. Добавляет обработчики событий.

### Поля класса:

* `cardElement: HTMLElement` - элемент карточки товара.
* `productDetails: Product | null` - данные о текущем товаре.
* `addButton: HTMLButtonElement` - кнопка "Купить

### Методы класса:

* `setProductDetails(details: Product): void` - задаёт данные товара для отображения.
* `onAddToBasket(callback: (productId: number) => void): void `- добавляет обработчик нажатия кнопки "Купить".
* `render(): void` - отрисовывает карточку товара.

### Поля класса:

* `_submit` - Кнопка отправки формы.
* `_errors` - DOM-элемент для отображения ошибок, возникающих при вводе данных в форму.
### Методы класса:

* `valid` - Устанавливает состояние доступности кнопки отправки.
* `errors` - Устанавливает текст ошибок в контейнере ошибок формы.
* `clearValue` - Очищает все значения в форме.
* `protected onInputChanges` - Вызывается при изменении значения в любом поле формы и передает событие изменения значения конкретного поля через events.
* `render` - Обновляет состояние формы, включая ее валидацию и сообщения об ошибках, и применяет значения для всех полей.
### Класс Modal:

Класс представляет собой универсальный инструмент для работы с модальным окном, позволяющим отображать различное содержимое по шаблонам. Имплементирует интерфейс наследует класс Component<IModalData>.

### Поля класса:

* `_closeButton` - DOM-элемент кнопки закрытия модального окна, который реагирует на нажатие для закрытия окна.
* `_content` - DOM-элемент, предназначенный для отображения содержимого модального окна.

## Слой Presenter
Слоем представлением будет тот код, который находится в файле src\index.ts, поскольку приложения небольшое.

Так как используется Событийно-ориентированный подход, используются следующие события:

* `cards:changed` - изменение каталога товаров.
* `card:selected` - выбор карточки в каталоге.
* `card:basket` - выбор карточки в каталоге.
* `basket:open` - открыить корзину.
* `basket:changed` - изменение данных в корзине.
* `modal:open` - открыть модальное окно.
* `modal:close` - закрыть модальное окно.
* `order:changed` - изменение в форме заказа.
* `order:open` - открытие формы заказа.
* `order:changed` - изменение в форме заказа.
* `order:submit` - переход на след. этап.
* `contacts:submit` - подтверждение заказа.
* `order..*:changed` - изменение полей в форме заказа.
* `formerrors:changed` - валидация полей.
* `preview:changed` - изменение превью карточки.

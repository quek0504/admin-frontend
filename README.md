# Mall Admin Dashboard

Frontend admin interface for my personal project [learning](https://github.com/quek0504/learning).

This project is initialized with [Ant Design Pro](https://pro.ant.design). Here is the preview of Ant Design Pro admin [dashboard](https://preview.pro.ant.design/). Follow is the quick guide on how to use.

## Getting Started

Install `node_modules`:

```bash
npm install
```

or

```bash
yarn
```
After installation, start the server in `pre` environment. Then, open the url in browser and you are ready to go.

```bash
yarn start:pre
```


## Example
### Proxy setting example
Proxy setting for `pre` environment has been configured in `config/proxy.js`. All requests will be made to http://localhost:88. 
```bash
  pre: {
    '/api/': {
      target: 'http://localhost:88',
      changeOrigin: true,
      pathRewrite: {
        '^': '',
      },
    },
  },
```
Example of `service.js` file. You don't need to provide full endpoint eg. http://localhost:88/api/product/category/list/tree.
```bash
export async function queryProductCategory() {
  return request('/api/product/category/list/tree');
}
```
Note: Proxy doesn't work in production environment. More info on deployment please see [docs](https://pro.ant.design/docs/deploy).

### Add new page example
1. Add new routes in `config/config.js`. Icon name can be found in [docs](https://ant.design/components/icon/).
```bash
routes: [
    {
      path: '/',
      component: '../layouts/BlankLayout',
      routes: [
      
        .....
        
        {
          path: '/',
          component: '../layouts/BasicLayout',
          Routes: ['src/pages/Authorized'],
          authority: ['admin', 'user'],
          routes: [

            ......
            
                                                             // add new routes at this level
            
            {
              name: 'product',
              icon: 'ShoppingCartOutlined',                 // icon name
              path: '/product',
              routes: [
                {
                  path: '/',
                  redirect: '/product/category',
                },
                {
                  name: 'category',
                  icon: 'smile',
                  path: '/product/category',
                  component: './product/category',          // new page directory
                },
              ],
            },
           
           .....
           
          ],
        },
      ],
    },
  ],
```

2. Create new directory `./product/category` in `src/pages` and create new file `index.jsx`. For example, `src/pages/product/category/index.jsx`.

3. Configure left sidebar menu display name in `src/locales/${language-folder}/menu.js`.
```bash
  'menu.product': 'Product',
  'menu.product.category': 'Category',
```

## Scripts Provided by Ant Design Pro

Ant Design Pro provides some useful script to help you quick start and build with web project, code style check and test.

Scripts provided in `package.json`. It's safe to modify or add additional script:

### Start project

```bash
npm start
```

### Build project

```bash
npm run build
```

### Check code style

```bash
npm run lint
```

You can also use script to auto fix some lint error:

```bash
npm run lint:fix
```

### Test code

```bash
npm test
```

## More

You can view full document on Ant Design Pro [official website](https://pro.ant.design). And here is the link to [github](https://github.com/ant-design/ant-design-pro).

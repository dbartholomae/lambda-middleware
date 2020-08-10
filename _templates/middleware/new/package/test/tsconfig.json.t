---
to: packages/<%= h.inflection.dasherize(name.toLowerCase()) %>/test/tsconfig.json
---
{
  "compilerOptions": {
    "baseUrl": ".",
    "module": "esnext",
    "esModuleInterop": true,
    "target": "es5",
    "lib": ["es6", "dom"],
    "sourceMap": false,
    "jsx": "react",
    "moduleResolution": "node",
    "rootDir": "../",
    "forceConsistentCasingInFileNames": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noImplicitAny": true,
    "importHelpers": true,
    "strictNullChecks": true,
    "suppressImplicitAnyIndexErrors": true,
    "noUnusedLocals": true
  }
}

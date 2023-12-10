import { Transform } from 'class-transformer';

export default function TransformDate() {
  const toPlain = Transform((value) => new Date(String(value)).toISOString(), {
    toPlainOnly: true,
  });

  const toClass = Transform((value) => new Date(String(value)), {
    toClassOnly: true,
  });

  return function (target: any, key: string) {
    toPlain(target, key);
    toClass(target, key);
  };
}

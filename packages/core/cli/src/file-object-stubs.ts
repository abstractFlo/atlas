/**
 * Config for docker-compose yml
 */
export const dockerCompose = {
  version: '3.3',
  services: {
    altv: {
      build: {
        context: '.docker',
        args: ['BRANCH=${SERVER_BRANCH:-release}']
      },
      image: 'altv:latest',
      env_file: ['.env'],
      container_name: 'altv',
      working_dir: '/altv',
      volumes: [
        '${ATLAS_PROJECT_PATH}env:/altv/.env',
        '${ATLAS_PROJECT_PATH}/${ATLAS_BUILD_OUTPUT}/package.json:/altv/package.json',
        '${ATLAS_PROJECT_PATH}/${ATLAS_BUILD_OUTPUT}/resources:/altv/resources',
        '${ATLAS_PROJECT_PATH}/docker-data/server.log:/altv/server.log',
        '${ATLAS_PROJECT_PATH}/node_modules:/altv/node_modules',
        '${ATLAS_PROJECT_PATH}/${ATLAS_BUILD_OUTPUT}/server.cfg:/altv/server.cfg',
        '/etc/localtime:/etc/localtime:ro'
      ],
      ports: ['7788:7788', '7788:7788/udp'],
      tty: true
    }
  }
};
